const { User, Account } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
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
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body,
        'name', 'email', 'phoneNumber', 'address', 'state', 'lga',
        'dateOfBirth', 'nextOfKinName', 'nextOfKinPhone', 'nextOfKinRelationship',
        'idType', 'idNumber', 'occupation', 'employer',
        'bankName', 'accountNumber', 'maritalStatus', 'membershipType'
    );

    // Handle files if they were uploaded
    if (req.files) {
        if (req.files.profilePicture) filteredBody.profilePicture = req.files.profilePicture[0].filename;
        if (req.files.addressProof) filteredBody.addressProof = req.files.addressProof[0].filename;
    } else if (req.file) { // fallback for single file upload if used
        filteredBody.profilePicture = req.file.filename;
    }

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
 * /api/v1/users/submit-onboarding:
 *   patch:
 *     summary: Submit detailed membership info and request approval
 *     tags: [Users]
 */
exports.submitOnboarding = catchAsync(async (req, res, next) => {
    // 1) Filtered out unwanted fields
    const filteredBody = filterObj(req.body,
        'phoneNumber', 'address', 'state', 'lga',
        'dateOfBirth', 'nextOfKinName', 'nextOfKinPhone', 'nextOfKinRelationship',
        'idType', 'idNumber', 'idImage', 'profilePicture',
        'occupation', 'employer', 'nokName', 'nokPhone', 'gender'
    );

    // 2) Update user document and change status
    const updatedUser = await User.findByPk(req.user.id);

    if (!updatedUser) {
        return next(new AppError('User not found', 404));
    }

    // Map frontend camelCase to backend snake_case if necessary
    await updatedUser.update({
        ...filteredBody,
        phoneNumber: req.body.phone || req.body.phoneNumber,
        dateOfBirth: req.body.dob || req.body.dateOfBirth,
        nextOfKinName: req.body.nokName || req.body.nextOfKinName,
        nextOfKinPhone: req.body.nokPhone || req.body.nextOfKinPhone,
        nextOfKinRelationship: req.body.nokRelationship || req.body.nextOfKinRelationship,
        idNumber: req.body.idNumber || req.body.idNumber,
        idImage: req.files?.idImage ? req.files.idImage[0].filename : undefined,
        profilePicture: req.files?.profilePicture ? req.files.profilePicture[0].filename : undefined,
        status: 'pending_approval'
    });

    try {
        await new Email(updatedUser, '').sendOnboardingComplete();
    } catch (err) {
        console.error('Email failed to send:', err);
    }

    res.status(200).json({
        status: 'success',
        message: 'Onboarding submitted successfully. Your account is now pending approval.',
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
    const where = {};
    if (req.query.status) {
        where.status = req.query.status;
    }

    const users = await User.findAll({
        where,
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

    // 1. Update Role to 'member' and Status to 'active'
    user.role = 'member';
    user.status = 'active';

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

/**
 * @swagger
 * /api/v1/users/{id}/reject:
 *   patch:
 *     summary: Reject a user's membership application
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: User application rejected
 *       400:
 *         description: Missing reason or user cannot be rejected
 */
exports.rejectMember = catchAsync(async (req, res, next) => {
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
        return next(new AppError('A rejection reason is required', 400));
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    if (user.status !== 'pending_approval') {
        return next(new AppError('Only users pending approval can be rejected', 400));
    }

    // 1. Update Status to 'rejected' and store reason
    user.status = 'rejected';
    user.rejectionReason = reason;

    await user.save({ validate: false });

    // 2. Send Email
    try {
        await new Email(user, '').sendApplicationRejected(reason);
    } catch (err) {
        console.error('Email failed to send for rejection:', err);
        // Continue even if email fails
    }

    res.status(200).json({
        status: 'success',
        message: 'User application rejected and applicant notified.',
        data: {
            user
        }
    });
});

/**
 * @swagger
 * /api/v1/users/{id}/admin-update:
 *   patch:
 *     summary: Update user role or status (Admin only)
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
 *         description: User updated successfully
 */
exports.adminUpdateUser = catchAsync(async (req, res, next) => {
    const {
        role,
        status,
        name,
        phoneNumber,
        bankName,
        accountNumber,
        address,
        lga,
        state,
        occupation,
        employer,
        maritalStatus,
        gender,
        membershipType
    } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    // Role validation
    if (role) {
        const allowedRoles = ['super_admin', 'staff', 'member', 'user'];
        if (!allowedRoles.includes(role)) return next(new AppError('Invalid role', 400));
        user.role = role;
    }

    // Status validation
    if (status) {
        const allowedStatuses = ['active', 'inactive', 'suspended', 'pending_onboarding', 'pending_approval'];
        if (!allowedStatuses.includes(status)) return next(new AppError('Invalid status', 400));
        user.status = status;
    }

    // Basic Fields update
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bankName) user.bankName = bankName;
    if (accountNumber) user.accountNumber = accountNumber;
    if (address) user.address = address;
    if (lga) user.lga = lga;
    if (state) user.state = state;
    if (occupation) user.occupation = occupation;
    if (employer) user.employer = employer;
    if (maritalStatus) user.maritalStatus = maritalStatus;
    if (gender) user.gender = gender;
    if (membershipType) user.membershipType = membershipType;

    await user.save({ validate: false });

    res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: {
            user
        }
    });
});

/**
 * @swagger
 * /api/v1/users/admin-create:
 *   post:
 *     summary: Create user directly with role (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
exports.adminCreateUser = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return next(new AppError('Please provide name, email, password and role', 400));
    }

    const allowedRoles = ['super_admin', 'staff', 'member', 'user'];
    if (!allowedRoles.includes(role)) return next(new AppError('Invalid role', 400));

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return next(new AppError('A user with that email already exists', 400));
    }

    const newUser = await User.create({
        name,
        email,
        password,
        role,
        isEmailVerified: true,
        status: 'active'
    });

    // Remove password from output
    newUser.password = undefined;

    // If making a member, we should consider generating accounts, but keeping it simple for now

    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
            user: newUser
        }
    });
});
