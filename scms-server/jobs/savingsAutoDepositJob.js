const { UserSavingsPlan, Account, User, Transaction, sequelize } = require('../models');
const { formatAmount } = require('../utils/accountHelper');
const { recordTransaction } = require('../utils/transactionHelper');
const Email = require('../utils/email');

/**
 * Background job to process automated monthly deposits to savings plans
 * Runs daily at 12:00 AM (midnight)
 */
const processAutoSaveDeposits = async () => {
    console.log('[Savings Auto-Deposit Job] Starting automated deposits...');

    try {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const { Op } = require('sequelize');

        // Find active savings plans with monthly auto-save enabled
        const plansForDeposit = await UserSavingsPlan.findAll({
            where: {
                status: 'active',
                frequency: 'monthly',
                autoSaveAmount: {
                    [Op.gt]: 0
                },
                [Op.or]: [
                    { lastAutoSaveDate: null },
                    {
                        lastAutoSaveDate: {
                            [Op.lte]: thirtyDaysAgo
                        }
                    }
                ]
            },
            include: [
                { model: Account, as: 'account' },
                { model: User, as: 'user' }
            ]
        });

        console.log(`[Savings Auto-Deposit Job] Found ${plansForDeposit.length} plans for auto-deposit`);

        for (const plan of plansForDeposit) {
            await processAutoDeposit(plan);
        }

        console.log('[Savings Auto-Deposit Job] Completed successfully');
    } catch (error) {
        console.error('[Savings Auto-Deposit Job] Error:', error);
    }
};

/**
 * Process auto-deposit for a single savings plan
 */
const processAutoDeposit = async (plan) => {
    const planId = plan.id;
    const userId = plan.userId;
    const depositAmount = parseFloat(plan.autoSaveAmount);

    console.log(`[Plan #${planId}] Processing auto-deposit of ₦${depositAmount}`);

    const t = await sequelize.transaction();

    try {
        // Find user's main savings account
        const mainSavingsAccount = await Account.findOne({
            where: { userId, accountType: 'savings' }
        });

        if (!mainSavingsAccount) {
            console.error(`[Plan #${planId}] Main savings account not found for user ${userId}`);
            await t.rollback();
            return;
        }

        const mainAccountBalance = parseFloat(mainSavingsAccount.balance);

        // Check if sufficient balance
        if (mainAccountBalance < depositAmount) {
            console.warn(`[Plan #${planId}] Insufficient balance: ₦${mainAccountBalance} < ₦${depositAmount}`);

            await t.rollback();

            // Send email notification (no penalties, just a reminder)
            try {
                await new Email(plan.user, '').sendFailedAutoSaveNotice(plan, depositAmount, mainAccountBalance);
                console.log(`[Plan #${planId}] Failed auto-deposit email sent`);
            } catch (emailError) {
                console.error(`[Plan #${planId}] Failed to send email:`, emailError.message);
            }

            return;
        }

        // Sufficient balance - process transfer
        // 1. Debit from main savings account
        await recordTransaction({
            accountId: mainSavingsAccount.id,
            transactionType: 'transfer_out',
            amount: depositAmount,
            description: `Auto-deposit to Savings Plan #${planId}`,
            performedBy: userId,
            t
        });

        // 2. Credit to plan account
        await recordTransaction({
            accountId: plan.account.id,
            transactionType: 'transfer_in',
            amount: depositAmount,
            description: `Automated monthly deposit`,
            performedBy: userId,
            t
        });

        // 3. Update plan's last auto-save date
        await plan.update(
            { lastAutoSaveDate: new Date() },
            { transaction: t }
        );

        await t.commit();

        console.log(`[Plan #${planId}] Auto-deposit successful. New plan balance: ₦${parseFloat(plan.account.balance) + depositAmount}`);

    } catch (error) {
        await t.rollback();
        console.error(`[Plan #${planId}] Auto-deposit error:`, error);
    }
};

module.exports = { processAutoSaveDeposits };
