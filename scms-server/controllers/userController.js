const { User, Account } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
const { generateAccountNumber } = require('../utils/accountHelper');

/**
 * @swagger
 * /api/v1/users/update-profile:
 *   patch:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               state:
 *                 type: string
 *               lga:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               nextOfKinName:
 *                 type: string
 *               nextOfKinPhone:
 *                 type: string
 *               nextOfKinRelationship:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
exports.updateProfile = catchAsync(async (req, res, next) => {
    // 0) Ensure only users in onboarding can use this specific route
    if (req.user.role !== 'user') {
        return next(new AppError('This profile update route is only for users in the onboarding phase. Members and Admins are restricted.', 403));
    }

    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body,
        'name', 'email', 'phoneNumber', 'address', 'state', 'lga',
        'dateOfBirth', 'nextOfKinName', 'nextOfKinPhone', 'nextOfKinRelationship',
        'idType', 'idNumber', 'idImage', 'profilePicture'
    );

    // 3) Update user document
    // We use User.update instead of user.save() to avoid running validations on other fields or hooks if not needed,
    // but findByPk + save is also fine. Let's use update for simple field updates on the authenticated user.
    // Actually, Sequelize update returns [numberOfAffectedRows], not the record.
    // So we update then fetch, or just return the data we updated.

    await User.update(filteredBody, {
        where: { id: req.user.id }
    });

    const updatedUser = await User.findByPk(req.user.id);

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

/**
 * @swagger
 * /api/v1/users/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] }
    });

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

const PaystackService = require('../services/paystackService');

/**
 * @swagger
 * /api/v1/users/{id}/approve:
 *   patch:
 *     summary: Approve a user to become a member
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User approved and accounts created
 */
exports.approveMember = catchAsync(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    if (user.role === 'member' || user.role === 'staff' || user.role === 'super_admin') {
        return next(new AppError('User is already a member or admin', 400));
    }

    // 1. Update Role to 'member'
    user.role = 'member';

    // 2. Create Paystack Customer
    try {
        const customerData = await PaystackService.createCustomer(user);
        user.paystackCustomerCode = customerData.customer_code;
    } catch (err) {
        console.error('Failed to create Paystack customer:', err.message);
        // We continue anyway, as the member role is more important than the DVA for now
    }

    await user.save();

    // 3. Auto-Create Accounts (Savings & Share Capital)
    const accountTypes = ['savings', 'share_capital'];
    const createdAccounts = [];

    for (const type of accountTypes) {
        // Check if account exists (idempotency)
        let account = await Account.findOne({
            where: { userId: user.id, accountType: type }
        });

        if (!account) {
            const accountNumber = await generateAccountNumber();
            account = await Account.create({
                userId: user.id,
                accountNumber,
                accountType: type,
                balance: 0.00,
                status: 'active',
                openedAt: new Date()
            });
            createdAccounts.push(account);

            // 4. Assign Paystack Dedicated Virtual Account (only for savings)
            if (type === 'savings' && user.paystackCustomerCode) {
                try {
                    const dvaData = await PaystackService.assignDedicatedAccount(user.paystackCustomerCode);
                    account.paystackDedicatedAccountNumber = dvaData.account_number;
                    account.paystackDedicatedAccountBank = dvaData.bank.name;
                    account.paystackDedicatedAccountName = dvaData.account_name;
                    await account.save();
                } catch (err) {
                    console.error('Failed to assign Paystack DVA:', err.message);
                }
            }
        }
    }

    res.status(200).json({
        status: 'success',
        message: 'User approved and upgraded to member. Accounts created.',
        data: {
            user,
            createdAccounts
        }
    });
});
