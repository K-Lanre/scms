const { Loan, LoanRepayment, Account, Transaction, sequelize } = require('../models');
const { recordTransaction } = require('../utils/transactionHelper');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { formatAmount } = require('../utils/accountHelper');
const { logAction } = require('../utils/auditLogger');

/**
 * @swagger
 * /api/v1/loans/{id}/repay:
 *   post:
 *     summary: Make a manual loan repayment
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Repayment amount
 *     responses:
 *       200:
 *         description: Repayment successful
 */
exports.makeManualRepayment = catchAsync(async (req, res, next) => {
    const { amount } = req.body;
    const loanId = req.params.id;

    if (!amount || amount <= 0) {
        return next(new AppError('Repayment amount must be greater than 0', 400));
    }

    const loan = await Loan.findByPk(loanId);
    if (!loan) {
        return next(new AppError('Loan not found', 404));
    }

    // Only allow repayment for disbursed or repaying loans
    if (loan.status !== 'disbursed' && loan.status !== 'repaying' && loan.status !== 'defaulted') {
        return next(new AppError(`Cannot make repayment for loan in ${loan.status} status`, 400));
    }

    // Verify user owns the loan
    if (loan.userId !== req.user.id) {
        return next(new AppError('You can only make payments on your own loans', 403));
    }

    // Find member's savings account to debit
    const account = await Account.findOne({
        where: { userId: loan.userId, accountType: 'savings' }
    });

    if (!account) {
        return next(new AppError('Your savings account was not found', 404));
    }

    // Check sufficient balance
    if (parseFloat(account.balance) < parseFloat(amount)) {
        return next(new AppError(`Insufficient balance. You have ₦${account.balance}, but trying to pay ₦${amount}`, 400));
    }

    const t = await sequelize.transaction();

    try {
        // 1. Calculate principal and interest portions
        const principalPortion = (parseFloat(amount) * parseFloat(loan.loanAmount)) / parseFloat(loan.totalRepayable);
        const interestPortion = parseFloat(amount) - principalPortion;

        // 2. Debit from account
        const financialTransaction = await recordTransaction({
            accountId: account.id,
            transactionType: 'loan_repayment',
            amount,
            description: `Loan repayment for Loan #${loan.id}`,
            performedBy: req.user.id,
            t
        });

        // 3. Create LoanRepayment record
        await LoanRepayment.create({
            loanId: loan.id,
            transactionId: financialTransaction.id,
            amount: formatAmount(amount),
            principal: formatAmount(principalPortion),
            interest: formatAmount(interestPortion),
            paidAt: new Date()
        }, { transaction: t });

        // 4. Update Loan balance and status
        const newOutstanding = parseFloat(loan.outstandingBalance) - parseFloat(amount);
        const newStatus = newOutstanding <= 0 ? 'completed' : 'repaying';

        // Reset failed deduction count on successful payment
        await loan.update({
            outstandingBalance: formatAmount(Math.max(0, newOutstanding)),
            status: newStatus,
            failedDeductionCount: 0,
            lastDeductionDate: new Date() // Track last payment for automated loans too
        }, { transaction: t });

        await t.commit();

        logAction(req, 'LOAN_REPAYMENT', { loanId: loan.id, amount, newOutstanding });

        res.status(200).json({
            status: 'success',
            message: newStatus === 'completed' ? 'Loan fully repaid!' : 'Payment successful',
            data: {
                loan: {
                    id: loan.id,
                    outstandingBalance: formatAmount(Math.max(0, newOutstanding)),
                    status: newStatus
                },
                repayment: {
                    amount: formatAmount(amount),
                    principal: formatAmount(principalPortion),
                    interest: formatAmount(interestPortion)
                }
            }
        });
    } catch (error) {
        await t.rollback();
        return next(error);
    }
});

/**
 * @swagger
 * /api/v1/loans/{id}/repayments:
 *   get:
 *     summary: Get repayment history for a loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Repayment history retrieved
 */
exports.getRepaymentHistory = catchAsync(async (req, res, next) => {
    const loanId = req.params.id;

    const loan = await Loan.findByPk(loanId);
    if (!loan) {
        return next(new AppError('Loan not found', 404));
    }

    // Allow user to see their own loans, or admin to see all
    if (loan.userId !== req.user.id && !['admin', 'super_admin'].includes(req.user.role)) {
        return next(new AppError('You can only view your own loan history', 403));
    }

    const repayments = await LoanRepayment.findAll({
        where: { loanId },
        include: [{
            model: Transaction,
            as: 'transaction',
            attributes: ['reference', 'transactionDate', 'status']
        }],
        order: [['paidAt', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: repayments.length,
        data: {
            loan: {
                id: loan.id,
                loanAmount: loan.loanAmount,
                totalRepayable: loan.totalRepayable,
                outstandingBalance: loan.outstandingBalance,
                status: loan.status
            },
            repayments
        }
    });
});
