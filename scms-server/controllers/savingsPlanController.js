const { UserSavingsPlan, SavingsProduct, Account, sequelize } = require('../models');
const { generateAccountNumber } = require('../utils/accountHelper');
const { recordTransaction } = require('../utils/transactionHelper');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

/**
 * @swagger
 * /api/v1/savings-plans:
 *   post:
 *     summary: Create a new savings plan (Subscribe to a product)
 *     tags: [Savings Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - duration
 *             properties:
 *               productId:
 *                 type: integer
 *               targetAmount:
 *                 type: number
 *               duration:
 *                 type: integer
 *                 description: Duration in days
 *               autoSaveAmount:
 *                 type: number
 *               frequency:
 *                 type: string
 *                 enum: [daily, weekly, monthly, manual]
 *     responses:
 *       201:
 *         description: Plan created successfully
 */
exports.createPlan = catchAsync(async (req, res, next) => {
    const { productId, targetAmount, duration, autoSaveAmount, frequency } = req.body;
    const userId = req.user.id;

    // 1. Validation
    if (!productId || !duration) {
        return next(new AppError('Product ID and Duration are required', 400));
    }

    const product = await SavingsProduct.findByPk(productId);
    if (!product) {
        return next(new AppError('Savings product not found', 404));
    }

    if (product.status !== 'active') {
        return next(new AppError('This savings product is currently inactive', 400));
    }

    // Check duration limits
    if (duration < product.minDuration) {
        return next(new AppError(`Duration must be at least ${product.minDuration} days`, 400));
    }
    if (product.maxDuration && duration > product.maxDuration) {
        return next(new AppError(`Duration cannot exceed ${product.maxDuration} days`, 400));
    }

    const t = await sequelize.transaction();

    try {
        // 2. Create a specific Account for this plan
        const accountNumber = await generateAccountNumber(); // This helper needs to be robust enough

        const planAccount = await Account.create({
            userId,
            accountNumber, // We might want a prefix or suffix to distinguish
            accountType: 'savings_plan',
            balance: 0.00,
            status: 'active'
        }, { transaction: t });

        // 3. Create UserSavingsPlan
        const startDate = new Date();
        const maturityDate = new Date(startDate);
        maturityDate.setDate(startDate.getDate() + parseInt(duration));

        const savingsPlan = await UserSavingsPlan.create({
            userId,
            productId,
            accountId: planAccount.id,
            targetAmount: targetAmount || null,
            duration,
            startDate,
            maturityDate,
            autoSaveAmount: autoSaveAmount || null,
            frequency: frequency || 'manual',
            status: 'active'
        }, { transaction: t });

        await t.commit();

        res.status(201).json({
            status: 'success',
            data: {
                plan: savingsPlan,
                account: planAccount
            }
        });
    } catch (error) {
        await t.rollback();
        return next(error);
    }
});

/**
 * @swagger
 * /api/v1/savings-plans:
 *   get:
 *     summary: Get my savings plans
 *     tags: [Savings Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's savings plans
 */
exports.getMyPlans = catchAsync(async (req, res, next) => {
    const plans = await UserSavingsPlan.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: SavingsProduct,
                as: 'product',
                attributes: ['name', 'interestRate', 'penaltyPercentage']
            },
            {
                model: Account,
                as: 'account',
                attributes: ['accountNumber', 'balance']
            }
        ]
    });

    res.status(200).json({
        status: 'success',
        results: plans.length,
        data: {
            plans
        }
    });
});

/**
 * @swagger
 * /api/v1/savings-plans/{id}/withdraw:
 *   post:
 *     summary: Withdraw from a savings plan (with penalty check)
 *     tags: [Savings Plans]
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
 *         description: Withdrawal successful
 */
exports.withdrawFromPlan = catchAsync(async (req, res, next) => {
    const planId = req.params.id;
    const userId = req.user.id;

    const plan = await UserSavingsPlan.findOne({
        where: { id: planId, userId },
        include: [{ model: SavingsProduct, as: 'product' }]
    });

    if (!plan) {
        return next(new AppError('Savings plan not found', 404));
    }

    if (plan.status !== 'active') {
        return next(new AppError('Plan is not active', 400));
    }

    const account = await Account.findByPk(plan.accountId);
    const balance = parseFloat(account.balance);

    if (balance <= 0) {
        return next(new AppError('No funds to withdraw', 400));
    }

    // Check maturity
    const now = new Date();
    const isMature = now >= plan.maturityDate;
    let penaltyAmount = 0;

    if (!isMature) {
        if (!plan.product.allowEarlyWithdrawal) {
            return next(new AppError('Early withdrawal not allowed for this product', 400));
        }
        // Calculate penalty
        penaltyAmount = balance * (parseFloat(plan.product.penaltyPercentage) / 100);
    }

    const finalAmount = balance - penaltyAmount;

    // Find user's main savings account to credit
    const mainAccount = await Account.findOne({
        where: { userId, accountType: 'savings' }
    });

    if (!mainAccount) {
        return next(new AppError('Main savings account not found to receive funds', 400));
    }

    const t = await sequelize.transaction();

    try {
        // 1. Debit penalty if applicable
        if (penaltyAmount > 0) {
            await recordTransaction({
                accountId: account.id,
                transactionType: 'withdrawal',
                amount: penaltyAmount,
                description: `Early withdrawal penalty for Plan #${plan.id}`,
                performedBy: userId,
                t
            });
        }

        // 2. Transfer remaining balance to main account
        // Debit Plan Account
        await recordTransaction({
            accountId: account.id,
            transactionType: 'transfer_out',
            amount: finalAmount,
            description: `Withdrawal from Plan #${plan.id} to Main Account`,
            performedBy: userId,
            t
        });

        // Credit Main Account
        await recordTransaction({
            accountId: mainAccount.id,
            transactionType: 'transfer_in',
            amount: finalAmount,
            description: `Funds from Savings Plan #${plan.id}`,
            performedBy: userId,
            t
        });

        // 3. Update Plan status
        await plan.update({
            status: isMature ? 'completed' : 'liquidated',
        }, { transaction: t });

        // 4. Update Account status
        await account.update({ status: 'closed', closedAt: new Date() }, { transaction: t });

        await t.commit();

        res.status(200).json({
            status: 'success',
            data: {
                amountWithdrawn: finalAmount,
                penaltyDeducted: penaltyAmount,
                isMature
            }
        });

    } catch (error) {
        await t.rollback();
        return next(error);
    }
});
