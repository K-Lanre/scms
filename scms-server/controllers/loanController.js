const { Loan, Account, Transaction, sequelize, User } = require('../models');
const { recordTransaction } = require('../utils/transactionHelper');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { formatAmount } = require('../utils/accountHelper');

/**
 * @swagger
 * /api/v1/loans/apply:
 *   post:
 *     summary: Apply for a new loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loanAmount
 *               - duration
 *             properties:
 *               loanAmount:
 *                 type: number
 *                 description: Amount to borrow
 *               duration:
 *                 type: integer
 *                 description: Duration in months
 *               interestRate:
 *                 type: number
 *                 description: Monthly interest rate (defaults to 2%)
 *     responses:
 *       201:
 *         description: Loan application submitted
 */
const PaystackService = require('../services/paystackService');
const loanCalculator = require('../utils/loanCalculator');

/**
 * @swagger
 * /api/v1/loans/apply:
 *   post:
 *     summary: Apply for a new loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loanAmount
 *               - duration
 *             properties:
 *               loanAmount:
 *                 type: number
 *               duration:
 *                 type: integer
 *               interestRate:
 *                 type: number
 *               bankName:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               repaymentMode:
 *                 type: string
 *                 enum: [manual, automated]
 *               monthlyDeductionAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Loan application submitted
 */
exports.applyForLoan = catchAsync(async (req, res, next) => {
    const {
        loanAmount,
        duration,
        interestRate = 2,
        bankName,
        accountNumber,
        repaymentMode = 'manual',
        monthlyDeductionAmount
    } = req.body;

    if (!loanAmount || !duration) {
        return next(new AppError('Loan amount and duration are required', 400));
    }

    // Validate repayment mode
    if (!['manual', 'automated'].includes(repaymentMode)) {
        return next(new AppError('Repayment mode must be either "manual" or "automated"', 400));
    }

    // If automated, validate monthly deduction amount
    if (repaymentMode === 'automated') {
        if (!monthlyDeductionAmount || monthlyDeductionAmount <= 0) {
            return next(new AppError('Monthly deduction amount is required for automated repayment', 400));
        }

        // Calculate minimum payment to ensure loan can be paid within reasonable time
        const minPayment = loanCalculator.calculateMinimumPayment(loanAmount, interestRate, duration);

        if (monthlyDeductionAmount < minPayment) {
            return next(new AppError(
                `Monthly deduction amount (₦${monthlyDeductionAmount}) is too low. Minimum required: ₦${minPayment}`,
                400
            ));
        }
    }

    // Calculate loan details
    let totalInterest, totalRepayable, monthlyPayment, calculatedDuration;

    if (repaymentMode === 'automated') {
        // Use loan calculator for automated mode
        const schedule = loanCalculator.calculateMonthlySchedule(
            loanAmount,
            interestRate,
            monthlyDeductionAmount
        );

        totalInterest = schedule.totalInterest;
        totalRepayable = schedule.totalRepayable;
        monthlyPayment = monthlyDeductionAmount;
        calculatedDuration = schedule.months;
    } else {
        // Simple interest calculation for manual mode
        totalInterest = parseFloat(loanAmount) * (parseFloat(interestRate) / 100) * parseInt(duration);
        totalRepayable = parseFloat(loanAmount) + totalInterest;
        monthlyPayment = totalRepayable / parseInt(duration);
        calculatedDuration = duration;
    }

    // Update user bank details if provided
    if (bankName && accountNumber) {
        if (!req.user.bankName || !req.user.accountNumber) {
            await req.user.update({ bankName, accountNumber });
        }
    }

    const loan = await Loan.create({
        userId: req.user.id,
        loanAmount: formatAmount(loanAmount),
        interestRate: formatAmount(interestRate),
        duration: calculatedDuration,
        monthlyPayment: formatAmount(monthlyPayment),
        totalRepayable: formatAmount(totalRepayable),
        outstandingBalance: formatAmount(totalRepayable),
        status: 'pending',
        bankName: bankName || req.user.bankName,
        accountNumber: accountNumber || req.user.accountNumber,
        repaymentMode,
        monthlyDeductionAmount: repaymentMode === 'automated' ? formatAmount(monthlyDeductionAmount) : null
    });

    res.status(201).json({
        status: 'success',
        data: {
            loan,
            calculatedDuration: repaymentMode === 'automated' ? calculatedDuration : undefined,
            totalInterest: formatAmount(totalInterest)
        }
    });
});

/**
 * @swagger
 * /api/v1/loans:
 *   get:
 *     summary: Get all loans (Staff sees all, Members see their own)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 */
exports.getAllLoans = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.user.role === 'member') {
        filter = { userId: req.user.id };
    }

    const loans = await Loan.findAll({
        where: filter,
        include: [
            { model: User, as: 'borrower', attributes: ['name', 'email'] },
            { model: User, as: 'approver', attributes: ['name', 'email'] }
        ],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: loans.length,
        data: { loans }
    });
});

/**
 * @swagger
 * /api/v1/loans/{id}/review:
 *   patch:
 *     summary: Approve or reject a loan application
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 */
exports.reviewLoan = catchAsync(async (req, res, next) => {
    const { status, remarks } = req.body; // status: approved, rejected

    if (!['approved', 'rejected'].includes(status)) {
        return next(new AppError('Status must be approved or rejected', 400));
    }

    const loan = await Loan.findByPk(req.params.id);
    if (!loan) {
        return next(new AppError('Loan not found', 404));
    }

    if (loan.status !== 'pending') {
        return next(new AppError(`Cannot review loan in ${loan.status} status`, 400));
    }

    await loan.update({
        status,
        approvedBy: req.user.id
    });

    res.status(200).json({
        status: 'success',
        data: { loan }
    });
});

/**
 * @swagger
 * /api/v1/loans/{id}/disburse:
 *   post:
 *     summary: Disburse an approved loan to member's account via Paystack
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 */
exports.disburseLoan = catchAsync(async (req, res, next) => {
    const loan = await Loan.findByPk(req.params.id, {
        include: [{ model: User, as: 'borrower' }]
    });

    if (!loan) {
        return next(new AppError('Loan not found', 404));
    }

    if (loan.status !== 'approved') {
        return next(new AppError('Only approved loans can be disbursed', 400));
    }

    // Ensure we have destination bank details
    const destBank = loan.bankName || loan.borrower.bankName;
    const destAccount = loan.accountNumber || loan.borrower.accountNumber;

    if (!destBank || !destAccount) {
        return next(new AppError('Borrower bank details missing. Please update loan or user profile.', 400));
    }

    const t = await sequelize.transaction();

    try {
        // 1. Create Transfer Recipient
        // Note: In real app, you might map bank names to codes or ask user for code. 
        // For now, we assume '057' (Zenith) or pass a hardcoded code if testing, or try to lookup.
        // MOCK: We'll pass a dummy bank code '058' (GTBank) for simplicity if not provided.
        const bankCode = '058';

        const recipient = await PaystackService.createTransferRecipient(
            loan.borrower.name,
            destAccount,
            bankCode
        );

        // 2. Initiate Transfer
        // Amount in kobo
        const amountKobo = Math.round(loan.loanAmount * 100);
        const transfer = await PaystackService.initiateTransfer(
            amountKobo,
            recipient.recipient_code,
            `Loan Disbursement - ${loan.id}`
        );

        // 3. Update Loan Status
        const disbursedAt = new Date();
        const dueDate = loanCalculator.calculateDueDate(disbursedAt, loan.duration);

        await loan.update({
            status: 'disbursed',
            disbursedAt,
            nextPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            dueDate,
            originalDueDate: dueDate,
            paystackTransferRecipient: recipient.recipient_code,
            disbursementReference: transfer.reference
        }, { transaction: t });

        // 4. Record Transaction (System record of money leaving)
        // We credit the user's "Savings" account technically to show the flow? 
        // Or just log it. Usually, we might debit the Organization's account. 
        // For SCMS logic, let's just record it as a 'loan_disbursement' which doesn't necessarily hit the user's savings balance 
        // BUT if we want to show it in their history, we can record it.
        // Let's stick to recording it but NOT crediting their internal savings balance, 
        // because we sent the money OUT to their real bank.
        // So we just create a transaction record for history.

        await Transaction.create({
            accountId: null, // External transaction
            userId: loan.userId,
            transactionType: 'loan_disbursement',
            amount: loan.loanAmount,
            balanceAfter: 0, // Not applicable
            status: 'completed',
            reference: transfer.reference,
            description: `Loan disbursement to ${destBank} (${destAccount})`,
            performedBy: req.user.id,
            transactionDate: new Date()
        }, { transaction: t });


        await t.commit();

        res.status(200).json({
            status: 'success',
            message: 'Loan disbursed successfully to external account',
            data: {
                reference: transfer.reference,
                recipient: recipient.recipient_code
            }
        });
    } catch (error) {
        await t.rollback();
        return next(error);
    }
});
