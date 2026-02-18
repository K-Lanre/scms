const { Account, User } = require('../models');
const { generateAccountNumber } = require('../utils/accountHelper');
const { getAccountStatement } = require('../utils/transactionHelper');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * @swagger
 * /api/v1/accounts:
 *   post:
 *     summary: Create a new account for a user
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - accountType
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: User ID to create account for
 *               accountType:
 *                 type: string
 *                 enum: [savings, share_capital]
 *                 description: Type of account
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
exports.createAccount = catchAsync(async (req, res, next) => {
    const { userId, accountType } = req.body;

    // Validate user exists
    const user = await User.findByPk(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check if user already has this type of account
    const existingAccount = await Account.findOne({
        where: { userId, accountType }
    });

    if (existingAccount) {
        return next(new AppError(`User already has a ${accountType} account`, 400));
    }

    // Generate account number
    const accountNumber = await generateAccountNumber();

    // Create account
    const account = await Account.create({
        userId,
        accountNumber,
        accountType,
        balance: 0.00,
        status: 'active',
        openedAt: new Date()
    });

    res.status(201).json({
        status: 'success',
        data: {
            account: {
                id: account.id,
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                balance: account.balance,
                status: account.status,
                openedAt: account.openedAt
            }
        }
    });
});

/**
 * @swagger
 * /api/v1/accounts/my-accounts:
 *   get:
 *     summary: Get all accounts for authenticated user
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Accounts retrieved successfully
 *       401:
 *         description: Unauthorized
 */
exports.getMyAccounts = catchAsync(async (req, res, next) => {
    const accounts = await Account.findAll({
        where: { userId: req.user.id },
        attributes: ['id', 'accountNumber', 'accountType', 'balance', 'status', 'openedAt'],
        order: [['createdAt', 'ASC']]
    });

    res.status(200).json({
        status: 'success',
        results: accounts.length,
        data: {
            accounts
        }
    });
});

/**
 * @swagger
 * /api/v1/accounts/{id}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account retrieved successfully
 *       404:
 *         description: Account not found
 *       403:
 *         description: Forbidden
 */
exports.getAccountById = catchAsync(async (req, res, next) => {
    const account = await Account.findByPk(req.params.id, {
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
        }]
    });

    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    // Check authorization: owner or staff can view
    if (account.userId !== req.user.id && !['staff', 'super_admin'].includes(req.user.role)) {
        return next(new AppError('You do not have permission to view this account', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            account
        }
    });
});

/**
 * @swagger
 * /api/v1/accounts/{id}/statement:
 *   get:
 *     summary: Get account statement (transaction history)
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Statement retrieved successfully
 *       404:
 *         description: Account not found
 *       403:
 *         description: Forbidden
 */
exports.getAccountStatement = catchAsync(async (req, res, next) => {
    const account = await Account.findByPk(req.params.id);

    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    // Check authorization: owner or staff can view
    if (account.userId !== req.user.id && !['staff', 'super_admin'].includes(req.user.role)) {
        return next(new AppError('You do not have permission to view this statement', 403));
    }

    const { page = 1, limit = 20 } = req.query;
    const statement = await getAccountStatement(account.id, { page, limit });

    res.status(200).json({
        status: 'success',
        data: {
            account: {
                accountNumber: account.accountNumber,
                currentBalance: account.balance
            },
            ...statement
        }
    });
});
