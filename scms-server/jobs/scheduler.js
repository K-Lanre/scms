const cron = require('node-cron');
const { processAutomatedDeductions } = require('./loanDeductionJob');
const { processLoanDefaults } = require('./loanDefaultJob');
const { processMonthlyInterest } = require('./savingsInterestJob');
const { processMaturedPlans } = require('./savingsMaturityJob');
const { processAutoSaveDeposits } = require('./savingsAutoDepositJob');

/**
 * Initialize all scheduled jobs
 */
const startScheduler = () => {
    console.log('[Scheduler] Initializing cron jobs...');

    // Savings Auto-Deposit Job - Runs daily at 12:00 AM (midnight)
    cron.schedule('0 0 * * *', async () => {
        console.log('[Scheduler] Running Savings Auto-Deposit Job...');
        await processAutoSaveDeposits();
    }, {
        scheduled: true,
        timezone: "Africa/Lagos"
    });

    // Savings Interest Job - Runs monthly on 1st at 1:00 AM
    cron.schedule('0 1 1 * *', async () => {
        console.log('[Scheduler] Running Savings Interest Job...');
        await processMonthlyInterest();
    }, {
        scheduled: true,
        timezone: "Africa/Lagos"
    });

    // Loan Deduction Job - Runs daily at 2:00 AM
    cron.schedule('0 2 * * *', async () => {
        console.log('[Scheduler] Running Loan Deduction Job...');
        await processAutomatedDeductions();
    }, {
        scheduled: true,
        timezone: "Africa/Lagos" // Adjust to your timezone
    });

    // Loan Default Job - Runs daily at 3:00 AM
    cron.schedule('0 3 * * *', async () => {
        console.log('[Scheduler] Running Loan Default Job...');
        await processLoanDefaults();
    }, {
        scheduled: true,
        timezone: "Africa/Lagos"
    });

    // Savings Maturity Job - Runs daily at 4:00 AM
    cron.schedule('0 4 * * *', async () => {
        console.log('[Scheduler] Running Savings Maturity Job...');
        await processMaturedPlans();
    }, {
        scheduled: true,
        timezone: "Africa/Lagos"
    });

    console.log('[Scheduler] ✅ Cron jobs initialized successfully');
    console.log('[Scheduler] - Savings Auto-Deposit Job: Daily at 12:00 AM');
    console.log('[Scheduler] - Savings Interest Job: Monthly on 1st at 1:00 AM');
    console.log('[Scheduler] - Loan Deduction Job: Daily at 2:00 AM');
    console.log('[Scheduler] - Loan Default Job: Daily at 3:00 AM');
    console.log('[Scheduler] - Savings Maturity Job: Daily at 4:00 AM');
};

// Export individual job functions for manual testing
module.exports = {
    startScheduler,
    processAutomatedDeductions,
    processLoanDefaults,
    processMonthlyInterest,
    processMaturedPlans,
    processAutoSaveDeposits
};
