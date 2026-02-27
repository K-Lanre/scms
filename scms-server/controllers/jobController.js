const {
    processAutomatedDeductions,
    processLoanDefaults,
    processMonthlyInterest,
    processMaturedPlans,
    processAutoSaveDeposits
} = require('../jobs/scheduler');
const catchAsync = require('../utils/catchAsync');

/**
 * Manually trigger background jobs for testing/maintenance
 */
exports.runJob = catchAsync(async (req, res, next) => {
    const { jobType } = req.params;

    console.log(`[Admin] Manually triggering job: ${jobType}`);

    switch (jobType) {
        case 'loan-deductions':
            await processAutomatedDeductions();
            break;
        case 'loan-defaults':
            await processLoanDefaults();
            break;
        case 'savings-interest':
            await processMonthlyInterest();
            break;
        case 'savings-maturity':
            await processMaturedPlans();
            break;
        case 'auto-save':
            await processAutoSaveDeposits();
            break;
        default:
            return res.status(400).json({
                status: 'error',
                message: 'Invalid job type'
            });
    }

    res.status(200).json({
        status: 'success',
        message: `Job ${jobType} started successfully`
    });
});
