const { Loan, User } = require('../models');
const { formatAmount } = require('../utils/accountHelper');
const loanCalculator = require('../utils/loanCalculator');
const Email = require('../utils/email');

/**
 * Background job to process defaulted loans and apply extensions
 * Runs daily to check for overdue loans
 */
const processLoanDefaults = async () => {
    console.log('[Loan Default Job] Checking for overdue loans...');

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of day

        const { Op } = require('sequelize');

        // Find loans that are overdue
        const overdueLoans = await Loan.findAll({
            where: {
                dueDate: {
                    [Op.lt]: today
                },
                status: {
                    [Op.in]: ['disbursed', 'repaying']
                },
                outstandingBalance: {
                    [Op.gt]: 0
                }
            },
            include: [{ model: User, as: 'borrower' }]
        });

        console.log(`[Loan Default Job] Found ${overdueLoans.length} overdue loans`);

        for (const loan of overdueLoans) {
            await applyLoanExtension(loan);
        }

        // Also handle loans with 3+ failed deductions
        const failedDeductionLoans = await Loan.findAll({
            where: {
                repaymentMode: 'automated',
                failedDeductionCount: {
                    [Op.gte]: 3
                },
                status: {
                    [Op.in]: ['disbursed', 'repaying']
                },
                outstandingBalance: {
                    [Op.gt]: 0
                }
            },
            include: [{ model: User, as: 'borrower' }]
        });

        console.log(`[Loan Default Job] Found ${failedDeductionLoans.length} loans with failed deductions`);

        for (const loan of failedDeductionLoans) {
            await applyLoanExtension(loan);
        }

        console.log('[Loan Default Job] Completed successfully');
    } catch (error) {
        console.error('[Loan Default Job] Error:', error);
    }
};

/**
 * Apply 2-month extension to a defaulted loan
 */
const applyLoanExtension = async (loan) => {
    const loanId = loan.id;

    console.log(`[Loan #${loanId}] Applying default extension...`);

    try {
        // Calculate extension interest (2 months)
        const extensionInterest = loanCalculator.calculateExtensionInterest(
            loan.outstandingBalance,
            loan.interestRate,
            2
        );

        // Calculate new due date (60 days from current due date)
        const newDueDate = new Date(loan.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 60);

        // Update loan
        const newOutstanding = parseFloat(loan.outstandingBalance) + extensionInterest;

        await loan.update({
            status: 'defaulted',
            outstandingBalance: formatAmount(newOutstanding),
            dueDate: newDueDate,
            extensionCount: loan.extensionCount + 1,
            failedDeductionCount: 0 // Reset for next cycle
        });

        console.log(`[Loan #${loanId}] Extension applied: +₦${extensionInterest} interest, new due date: ${newDueDate.toISOString().split('T')[0]}`);

        // Send email notification
        try {
            await new Email(loan.borrower, '').sendLoanDefaultNotice(
                loan,
                extensionInterest,
                newDueDate.toISOString().split('T')[0]
            );
            console.log(`[Loan #${loanId}] Default notice email sent`);
        } catch (emailError) {
            console.error(`[Loan #${loanId}] Failed to send email:`, emailError.message);
        }

    } catch (error) {
        console.error(`[Loan #${loanId}] Extension error:`, error);
    }
};

module.exports = { processLoanDefaults };
