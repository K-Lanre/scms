const { Account } = require('../models');
const { recordTransaction } = require('../utils/transactionHelper');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
