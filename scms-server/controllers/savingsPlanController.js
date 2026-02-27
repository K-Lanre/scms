const { UserSavingsPlan, SavingsProduct, Account, sequelize } = require('../models');
const { generateAccountNumber } = require('../utils/accountHelper');
const { recordTransaction } = require('../utils/transactionHelper');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { logAction } = require('../utils/auditLogger');
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
    const { productId, planName, targetAmount, duration, autoSaveAmount, frequency, initialDeposit } = req.body;
    const userId = req.user.id;

    // 1. Validation
    if (!productId || !duration) {
        return next(new AppError('Product ID and Duration are required', 400));
    }

    const product = await SavingsProduct.findByPk(productId);
    if (!product) {
        return next(new AppError('Savings product not found', 404));
    }

    // Check min deposit for any plan
    if (initialDeposit && parseFloat(initialDeposit) < parseFloat(product.minDeposit || 0)) {
        return next(new AppError(`Minimum deposit for this plan is ₦${product.minDeposit}`, 400));
    }

    if (product.status !== 'active') {
        return next(new AppError('This savings product is currently inactive', 400));
    }

    // Check duration limits
    if (duration < product.minDuration) {
        return next(new AppError(`Duration must be at least ${product.minDuration} days`, 400));
    }

    const t = await sequelize.transaction();

    try {
        // 2. Create a specific Account for this plan
        const accountNumber = await generateAccountNumber();

        const planAccount = await Account.create({
            userId,
            accountNumber,
            accountType: 'savings_plan',
            balance: initialDeposit ? parseFloat(initialDeposit) : 0.00,
            status: 'active'
        }, { transaction: t });

        // If there's an initial deposit, deduct from main account
        if (initialDeposit && parseFloat(initialDeposit) > 0) {
            const mainAccount = await Account.findOne({
                where: { userId, accountType: 'savings', status: 'active' }
            });

            if (!mainAccount || parseFloat(mainAccount.balance) < parseFloat(initialDeposit)) {
                await t.rollback();
                return next(new AppError('Insufficient balance in your main account for the initial deposit', 400));
            }

            // Deduct from main
            await mainAccount.update({
                balance: parseFloat(mainAccount.balance) - parseFloat(initialDeposit)
            }, { transaction: t });

            // Record transactions
            await recordTransaction({
                accountId: mainAccount.id,
                type: 'debit',
                amount: initialDeposit,
                description: `Initial deposit to ${product.name} plan`,
                reference: `PLAN-INIT-${Date.now()}`
            }, t);

            await recordTransaction({
                accountId: planAccount.id,
                type: 'credit',
                amount: initialDeposit,
                description: `Initial deposit from main account`,
                reference: `PLAN-INIT-${Date.now()}`
            }, t);
        }

        // 3. Create UserSavingsPlan
        const startDate = new Date();
        const maturityDate = new Date(startDate);
        maturityDate.setDate(startDate.getDate() + parseInt(duration));

        const savingsPlan = await UserSavingsPlan.create({
            userId,
            productId,
            planName: planName || null,
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

        logAction(req, 'SAVINGS_PLAN_CREATED', { planId: savingsPlan.id, productId: savingsPlan.productId });

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
                attributes: ['name', 'interestRate', 'penaltyPercentage', 'type', 'category']
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
 * /api/v1/savings/plans/{id}:
 *   get:
 *     summary: Get specific savings plan details
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
 *         description: Success
 */
exports.getPlan = catchAsync(async (req, res, next) => {
    const plan = await UserSavingsPlan.findOne({
        where: { id: req.params.id, userId: req.user.id },
        include: [
            {
                model: SavingsProduct,
                as: 'product'
            },
            {
                model: Account,
                as: 'account'
            }
        ]
    });

    if (!plan) {
        return next(new AppError('Savings plan not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            plan
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

    // Logic for SafeBox: 24h Delay, No Penalty
    if (plan.product.type === 'safebox') {
        if (!plan.withdrawalRequestedAt) {
            // Stage 1: Request withdrawal
            await plan.update({ withdrawalRequestedAt: now });

            return res.status(200).json({
                status: 'success',
                message: 'Withdrawal requested. Funds will be available in 24 hours.',
                data: {
                    status: 'pending_24h',
                    withdrawalRequestedAt: now
                }
            });
        }

        // Stage 2: Complete withdrawal
        const hoursElapsed = (now - new Date(plan.withdrawalRequestedAt)) / (1000 * 60 * 60);
        if (hoursElapsed < 24) {
            return next(new AppError(`Withdrawal pending. Please wait ${Math.ceil(24 - hoursElapsed)} more hours.`, 400));
        }

        // No penalty for SafeBox
        penaltyAmount = 0;
    } else {
        // Logic for Targeted/Fixed: Immediate Withdrawal + Penalty if premature
        if (!isMature) {
            if (!plan.product.allowEarlyWithdrawal) {
                return next(new AppError('Early withdrawal not allowed for this product', 400));
            }

            // Calculate penalty (e.g. 20%)
            penaltyAmount = balance * (parseFloat(plan.product.penaltyPercentage || 0) / 100);
        }
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
                description: `Early withdrawal penalty (${plan.product.penaltyPercentage}%) for Plan #${plan.id}`,
                performedBy: userId
            }, t);
        }

        // 2. Transfer remaining balance to main account
        await recordTransaction({
            accountId: account.id,
            transactionType: 'transfer_out',
            amount: finalAmount,
            description: `Liquidation of Plan #${plan.id} to Main Account`,
            performedBy: userId
        }, t);

        await recordTransaction({
            accountId: mainAccount.id,
            transactionType: 'transfer_in',
            amount: finalAmount,
            description: `Funds from Savings Plan #${plan.id}`,
            performedBy: userId
        }, t);

        // 3. Update Plan status
        await plan.update({
            status: isMature ? 'completed' : 'liquidated',
            withdrawalRequestedAt: null // Reset for good measure
        }, { transaction: t });

        // 4. Update Account balance and status
        await account.update({
            balance: 0,
            status: 'closed',
            closedAt: new Date()
        }, { transaction: t });

        // Credit main account balance
        await mainAccount.update({
            balance: parseFloat(mainAccount.balance) + finalAmount
        }, { transaction: t });

        await t.commit();

        logAction(req, 'SAVINGS_PLAN_LIQUIDATED', { planId: plan.id, amount: finalAmount, isMature });

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
