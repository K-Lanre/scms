const { Account, Transaction, sequelize } = require('../models');
const { recordTransaction } = require('../utils/transactionHelper');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

/**
 * @swagger
 * /api/v1/transactions/deposit:
 *   post:
 *     summary: Deposit money into an account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - amount
 *             properties:
 *               accountId:
 *                 type: integer
 *                 description: Account ID to deposit into
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: Amount to deposit
 *               description:
 *                 type: string
 *                 description: Transaction description
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 */
exports.deposit = catchAsync(async (req, res, next) => {
    const { accountId, amount, description } = req.body;

    // Validate input
    if (!accountId || !amount) {
        return next(new AppError('Account ID and amount are required', 400));
    }

    if (amount <= 0) {
        return next(new AppError('Amount must be greater than 0', 400));
    }

    // Record transaction (includes all validations and balance update)
    const transaction = await recordTransaction({
        accountId,
        transactionType: 'deposit',
        amount,
        description: description || 'Cash deposit',
        performedBy: req.user.id
    });

    // Get updated account
    const account = await Account.findByPk(accountId);

    res.status(200).json({
        status: 'success',
        data: {
            transaction: {
                reference: transaction.reference,
                amount: transaction.amount,
                balanceAfter: transaction.balanceAfter,
                date: transaction.createdAt
            },
            account: {
                accountNumber: account.accountNumber,
                currentBalance: account.balance
            }
        }
    });
});

/**
 * @swagger
 * /api/v1/transactions/withdraw:
 *   post:
 *     summary: Withdraw money from an account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - amount
 *             properties:
 *               accountId:
 *                 type: integer
 *                 description: Account ID to withdraw from
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: Amount to withdraw
 *               description:
 *                 type: string
 *                 description: Transaction description
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Bad request or insufficient balance
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 */
exports.withdraw = catchAsync(async (req, res, next) => {
    const { accountId, amount, description } = req.body;

    // Validate input
    if (!accountId || !amount) {
        return next(new AppError('Account ID and amount are required', 400));
    }

    if (amount <= 0) {
        return next(new AppError('Amount must be greater than 0', 400));
    }

    // Record transaction (includes balance check and update)
    const transaction = await recordTransaction({
        accountId,
        transactionType: 'withdrawal',
        amount,
        description: description || 'Cash withdrawal',
        performedBy: req.user.id
    });

    // Get updated account
    const account = await Account.findByPk(accountId);

    res.status(200).json({
        status: 'success',
        data: {
            transaction: {
                reference: transaction.reference,
                amount: transaction.amount,
                balanceAfter: transaction.balanceAfter,
                date: transaction.createdAt
            },
            account: {
                accountNumber: account.accountNumber,
                currentBalance: account.balance
            }
        }
    });
});

/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Get all transactions (Filtered by user for members)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
exports.getAllTransactions = catchAsync(async (req, res, next) => {
    const { type, search } = req.query;
    const userId = req.user.id;
    const isStaff = ['staff', 'super_admin'].includes(req.user.role);

    const where = {};

    // Filter by type if provided
    if (type) {
        where.transactionType = type;
    }

    // Search by reference or description
    if (search) {
        where[Op.or] = [
            { reference: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    // If not staff, only show transactions belonging to user's accounts
    const accountInclude = {
        model: Account,
        as: 'account',
        attributes: ['id', 'accountNumber', 'accountType']
    };

    if (!isStaff) {
        accountInclude.where = { userId };
    }

    const transactions = await Transaction.findAll({
        where,
        include: [accountInclude],
        order: [['createdAt', 'DESC']],
        limit: 100 // Default limit
    });

    res.status(200).json({
        status: 'success',
        results: transactions.length,
        data: transactions
    });
});

/**
 * @swagger
 * /api/v1/transactions/transfer:
 *   post:
 *     summary: Transfer funds between accounts
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromAccountId
 *               - toAccountNumber
 *               - amount
 *             properties:
 *               fromAccountId:
 *                 type: integer
 *               toAccountNumber:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transfer successful
 */
exports.transfer = catchAsync(async (req, res, next) => {
    const { fromAccountId, toAccountNumber, amount, description } = req.body;

    if (!fromAccountId || !toAccountNumber || !amount) {
        return next(new AppError('Source account, destination account number, and amount are required', 400));
    }

    if (amount <= 0) {
        return next(new AppError('Amount must be greater than 0', 400));
    }

    // 1. Find source account and verify ownership
    const fromAccount = await Account.findOne({
        where: { id: fromAccountId, userId: req.user.id }
    });

    if (!fromAccount) {
        return next(new AppError('Source account not found or not owned by you', 404));
    }

    // 2. Find destination account
    const toAccount = await Account.findOne({
        where: { accountNumber: toAccountNumber }
    });

    if (!toAccount) {
        return next(new AppError('Destination account not found', 404));
    }

    if (fromAccount.id === toAccount.id) {
        return next(new AppError('Cannot transfer to the same account', 400));
    }

    // 3. Perform transfer within a transaction
    const t = await sequelize.transaction();

    try {
        // Record Debit
        const debitEntry = await recordTransaction({
            accountId: fromAccount.id,
            transactionType: 'transfer_out',
            amount,
            description: description || `Transfer to ${toAccountNumber}`,
            performedBy: req.user.id,
            t
        });

        // Record Credit
        const creditEntry = await recordTransaction({
            accountId: toAccount.id,
            transactionType: 'transfer_in',
            amount,
            description: description || `Transfer from ${fromAccount.accountNumber}`,
            performedBy: req.user.id,
            t
        });

        await t.commit();

        res.status(200).json({
            status: 'success',
            data: {
                reference: debitEntry.reference,
                amount,
                fromAccount: fromAccount.accountNumber,
                toAccount: toAccount.accountNumber
            }
        });
    } catch (error) {
        await t.rollback();
        throw error;
    }
});

/**
 * Simple lookup to validate account numbers on the frontend
 */
exports.findAccountByNumber = catchAsync(async (req, res, next) => {
    const { accountNumber } = req.params;

    const account = await Account.findOne({
        where: { accountNumber },
        include: [{
            model: require('../models').User,
            as: 'user',
            attributes: ['name']
        }]
    });

    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            accountNumber: account.accountNumber,
            accountType: account.accountType,
            ownerName: account.user?.name
        }
    });
});
