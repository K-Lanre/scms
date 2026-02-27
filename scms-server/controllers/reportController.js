const { Account, Loan, Transaction, LoanRepayment, sequelize } = require('../models');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');

/**
 * Balance Sheet Logic: Assets = Liabilities + Equity
 */
exports.getBalanceSheet = catchAsync(async (req, res, next) => {
    // Assets
    const outstandingLoans = await Loan.sum('outstandingBalance', {
        where: { status: { [Op.in]: ['disbursed', 'repaying', 'defaulted'] } }
    }) || 0;

    // Liquid Cash Calculation (Total Inflows - Total Outflows)
    // Inflows: deposits, transfer_in, loan_repayment
    // Outflows: withdrawals, transfer_out, loan_disbursement
    const inflows = await Transaction.findAll({
        attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
        where: {
            transactionType: { [Op.in]: ['deposit', 'transfer_in', 'loan_repayment'] },
            status: 'completed'
        }
    });

    const outflows = await Transaction.findAll({
        attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
        where: {
            transactionType: { [Op.in]: ['withdrawal', 'transfer_out', 'loan_disbursement'] },
            status: 'completed'
        }
    });

    const totalInflows = parseFloat(inflows[0]?.dataValues.total || 0);
    const totalOutflows = parseFloat(outflows[0]?.dataValues.total || 0);
    const liquidCash = totalInflows - totalOutflows;

    // Liabilities
    const memberSavings = await Account.sum('balance', {
        where: { accountType: { [Op.in]: ['savings', 'savings_plan'] } }
    }) || 0;

    // Equity
    const shareCapital = await Account.sum('balance', {
        where: { accountType: 'share_capital' }
    }) || 0;

    // Retained Earnings (Roughly: Total Interest Income - Total Interest/Dividend Expenses)
    const totalInterestIncome = await LoanRepayment.sum('interest') || 0;
    const totalExpenses = await Transaction.sum('amount', {
        where: {
            transactionType: { [Op.in]: ['interest', 'dividend'] },
            status: 'completed'
        }
    }) || 0;
    const retainedEarnings = totalInterestIncome - totalExpenses;

    res.status(200).json({
        status: 'success',
        data: {
            assets: {
                liquidCash: parseFloat(liquidCash.toFixed(2)),
                outstandingLoans: parseFloat(outstandingLoans.toFixed(2)),
                total: parseFloat((liquidCash + outstandingLoans).toFixed(2))
            },
            liabilities: {
                memberSavings: parseFloat(memberSavings.toFixed(2)),
                total: parseFloat(memberSavings.toFixed(2))
            },
            equity: {
                shareCapital: parseFloat(shareCapital.toFixed(2)),
                retainedEarnings: parseFloat(retainedEarnings.toFixed(2)),
                total: parseFloat((shareCapital + retainedEarnings).toFixed(2))
            },
            balance: {
                totalAssets: parseFloat((liquidCash + outstandingLoans).toFixed(2)),
                totalLiabilitiesAndEquity: parseFloat((memberSavings + shareCapital + retainedEarnings).toFixed(2))
            }
        }
    });
});

/**
 * Income Statement Logic: Revenue - Expenses = Net Profit
 */
exports.getIncomeStatement = catchAsync(async (req, res, next) => {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
        dateFilter = {
            createdAt: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            }
        };
    }

    // Revenue
    const interestIncome = await LoanRepayment.sum('interest', { where: dateFilter }) || 0;

    // Other potential income (application fees, etc. - adding placeholder for now)
    const otherIncome = 0;

    // Expenses
    const interestPaid = await Transaction.sum('amount', {
        where: {
            ...dateFilter,
            transactionType: 'interest',
            status: 'completed'
        }
    }) || 0;

    const dividendsPaid = await Transaction.sum('amount', {
        where: {
            ...dateFilter,
            transactionType: 'dividend',
            status: 'completed'
        }
    }) || 0;

    const netProfit = interestIncome + otherIncome - (interestPaid + dividendsPaid);

    res.status(200).json({
        status: 'success',
        data: {
            revenue: {
                loanInterestIncome: parseFloat(interestIncome.toFixed(2)),
                otherIncome: parseFloat(otherIncome.toFixed(2)),
                totalRevenue: parseFloat((interestIncome + otherIncome).toFixed(2))
            },
            expenses: {
                interestOnSavings: parseFloat(interestPaid.toFixed(2)),
                dividendsDistributed: parseFloat(dividendsPaid.toFixed(2)),
                totalExpenses: parseFloat((interestPaid + dividendsPaid).toFixed(2))
            },
            netProfit: parseFloat(netProfit.toFixed(2)),
            period: {
                startDate: startDate || 'Beginning',
                endDate: endDate || 'Now'
            }
        }
    });
});
