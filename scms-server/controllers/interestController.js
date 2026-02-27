const { Account, User, Transaction, PostingLog, sequelize } = require('../models');
const { formatAmount } = require('../utils/accountHelper');
const { recordTransaction } = require('../utils/transactionHelper');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { logAction } = require('../utils/auditLogger');
const { Op } = require('sequelize');

/**
 * Get statistics for a potential posting run (eligible members, total volume)
 */
exports.getPostingStats = catchAsync(async (req, res, next) => {
    const { type, rate = 0 } = req.query; // type: 'interest' or 'dividend'

    if (!['interest', 'dividend'].includes(type)) {
        return next(new AppError('Invalid posting type. Must be interest or dividend.', 400));
    }

    // Define which account type gets the posting
    const targetAccountType = type === 'interest' ? 'savings' : 'share_capital';

    // Find all active accounts of the target type with a balance > 0
    const { count, rows } = await Account.findAndCountAll({
        where: {
            accountType: targetAccountType,
            status: 'active',
            balance: {
                [Op.gt]: 0
            }
        },
        attributes: ['balance']
    });

    // Calculate total volume
    const totalVolume = rows.reduce((sum, account) => sum + parseFloat(account.balance), 0);

    // Estimate distribution
    const estimatedDistribution = type === 'interest'
        ? totalVolume * (parseFloat(rate) / 100)
        : totalVolume * (parseFloat(rate) / 100);

    res.status(200).json({
        status: 'success',
        data: {
            eligibleMembers: count,
            totalVolume: formatAmount(totalVolume),
            estimatedDistribution: formatAmount(estimatedDistribution),
            targetAccountType
        }
    });
});

/**
 * Process a bulk interest or dividend posting
 */
exports.processPosting = catchAsync(async (req, res, next) => {
    const { type, period, rate, isDryRun = true } = req.body;

    if (!['interest', 'dividend'].includes(type)) {
        return next(new AppError('Invalid posting type', 400));
    }

    if (!period || !rate || rate <= 0) {
        return next(new AppError('Period and a positive rate are required', 400));
    }

    // Check if this period/type combo was already posted
    const existingLog = await PostingLog.findOne({
        where: { type, period, status: 'completed' }
    });

    if (existingLog && !isDryRun) {
        return next(new AppError(`A ${type} posting for period '${period}' has already been completed.`, 400));
    }

    const targetAccountType = type === 'interest' ? 'savings' : 'share_capital';

    // Get eligible accounts
    const eligibleAccounts = await Account.findAll({
        where: {
            accountType: targetAccountType,
            status: 'active',
            balance: { [Op.gt]: 0 }
        }
    });

    if (eligibleAccounts.length === 0) {
        return next(new AppError('No eligible accounts found with a positive balance.', 404));
    }

    let totalAmountPosted = 0;
    let successfulPostings = 0;

    // --- DRY RUN Logic (No DB changes) ---
    if (isDryRun) {
        const preview = eligibleAccounts.slice(0, 5).map(acc => {
            const amount = parseFloat(acc.balance) * (parseFloat(rate) / 100);
            totalAmountPosted += amount;
            return {
                accountId: acc.id,
                userId: acc.userId,
                currentBalance: acc.balance,
                calculatedAmount: formatAmount(amount)
            };
        });

        // Calculate total for all, not just preview
        const actualTotal = eligibleAccounts.reduce((sum, acc) =>
            sum + (parseFloat(acc.balance) * (parseFloat(rate) / 100)), 0);

        return res.status(200).json({
            status: 'success',
            message: 'Dry run completed successfully',
            data: {
                isDryRun: true,
                summary: {
                    type,
                    period,
                    rate: `${rate}%`,
                    beneficiaryCount: eligibleAccounts.length,
                    totalAmount: formatAmount(actualTotal)
                },
                preview // Show first 5 calculations
            }
        });
    }

    // --- ACTUAL POSTING Logic (Atomic Transaction) ---
    const t = await sequelize.transaction();

    try {
        // 1. Create a pending PostingLog
        const postingLog = await PostingLog.create({
            type,
            period,
            rate,
            totalAmount: 0, // Will update after
            beneficiaryCount: eligibleAccounts.length,
            status: 'pending',
            performedBy: req.user.id
        }, { transaction: t });


        // 2. Process each account
        for (const account of eligibleAccounts) {
            const currentBalance = parseFloat(account.balance);
            const payoutAmount = currentBalance * (parseFloat(rate) / 100);

            if (payoutAmount <= 0) continue;

            const newBalance = currentBalance + payoutAmount;

            // Update account balance
            await account.update({ balance: formatAmount(newBalance) }, { transaction: t });

            // Create individual transaction record using the generic helper
            await Transaction.create({
                accountId: account.id,
                transactionType: type, // 'interest' or 'dividend'
                amount: formatAmount(payoutAmount),
                balanceAfter: formatAmount(newBalance),
                reference: `${type.toUpperCase()}-${period}-${account.id}-${Date.now().toString().slice(-4)}`,
                description: `${type.charAt(0).toUpperCase() + type.slice(1)} posting for ${period} @ ${rate}%`,
                performedBy: req.user.id,
                status: 'completed',
                completedAt: new Date()
            }, { transaction: t });

            totalAmountPosted += payoutAmount;
            successfulPostings++;
        }

        // 3. Finalize the PostingLog
        await postingLog.update({
            totalAmount: formatAmount(totalAmountPosted),
            status: 'completed',
            completedAt: new Date()
        }, { transaction: t });

        await t.commit();

        logAction(req, `${type.toUpperCase()}_POSTING`, {
            period,
            rate,
            totalAmount: totalAmountPosted,
            beneficiaryCount: successfulPostings
        });

        res.status(200).json({
            status: 'success',
            message: `${type} posted successfully to ${successfulPostings} accounts.`,
            data: {
                postingLogId: postingLog.id,
                type,
                period,
                totalAmountPosted: formatAmount(totalAmountPosted),
                beneficiaryCount: successfulPostings
            }
        });

    } catch (error) {
        await t.rollback();

        // Try to record the failure if possible (outside the aborted transaction)
        try {
            await PostingLog.create({
                type, period, rate, status: 'failed', performedBy: req.user.id
            });
        } catch (logErr) {
            console.error("Failed to save failed posting log", logErr);
        }

        next(new AppError(`Posting failed: ${error.message}`, 500));
    }
});


/**
 * Get history of past postings
 */
exports.getPostingHistory = catchAsync(async (req, res, next) => {
    const logs = await PostingLog.findAll({
        include: [{
            model: User,
            as: 'performer',
            attributes: ['id', 'name']
        }],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: logs.length,
        data: {
            logs
        }
    });
});
