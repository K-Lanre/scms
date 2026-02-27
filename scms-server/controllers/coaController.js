const { Loan, Account, LoanRepayment, Transaction, sequelize } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { Op } = require('sequelize');

/**
 * Get the real Chart of Accounts with current balances
 */
exports.getChartOfAccounts = catchAsync(async (req, res, next) => {
    // Assets
    const outstandingLoans = await Loan.sum('outstandingBalance', {
        where: { status: { [Op.in]: ['disbursed', 'repaying', 'defaulted'] } }
    }) || 0;

    // Liquid Cash (simulated from transactions for now, or just sum of all accounts?)
    // In a real system, we'd have a specific "Cash at Bank" account.
    // For this implementation, we'll derive it.
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
    const liquidCash = parseFloat(inflows[0]?.dataValues.total || 0) - parseFloat(outflows[0]?.dataValues.total || 0);

    // Liabilities
    const memberSavings = await Account.sum('balance', {
        where: { accountType: { [Op.in]: ['savings', 'savings_plan'] } }
    }) || 0;

    // Equity
    const shareCapital = await Account.sum('balance', {
        where: { accountType: 'share_capital' }
    }) || 0;
    const totalInterestIncome = await LoanRepayment.sum('interest') || 0;
    const totalExpenses = await Transaction.sum('amount', {
        where: {
            transactionType: { [Op.in]: ['interest', 'dividend'] },
            status: 'completed'
        }
    }) || 0;
    const retainedEarnings = totalInterestIncome - totalExpenses;

    const formatCurrency = (amount) => `₦${parseFloat(amount).toLocaleString()}`;

    const accounts = [
        { code: '1000', name: 'Assets', type: 'Header', balance: formatCurrency(liquidCash + outstandingLoans), status: 'Enabled' },
        { code: '1001', name: 'Cash at Bank', type: 'Asset', balance: formatCurrency(liquidCash), status: 'Enabled' },
        { code: '1002', name: 'Outstanding Loans', type: 'Asset', balance: formatCurrency(outstandingLoans), status: 'Enabled' },
        { code: '2000', name: 'Liabilities', type: 'Header', balance: formatCurrency(memberSavings), status: 'Enabled' },
        { code: '2001', name: 'Member Savings', type: 'Liability', balance: formatCurrency(memberSavings), status: 'Enabled' },
        { code: '3000', name: 'Equity', type: 'Header', balance: formatCurrency(shareCapital + retainedEarnings), status: 'Enabled' },
        { code: '3001', name: 'Share Capital', type: 'Equity', balance: formatCurrency(shareCapital), status: 'Enabled' },
        { code: '3002', name: 'Retained Earnings', type: 'Equity', balance: formatCurrency(retainedEarnings), status: 'Enabled' },
        { code: '4000', name: 'Income', type: 'Header', balance: formatCurrency(totalInterestIncome), status: 'Enabled' },
        { code: '5000', name: 'Expenses', type: 'Header', balance: formatCurrency(totalExpenses), status: 'Enabled' }
    ];

    res.status(200).json({
        status: 'success',
        data: accounts
    });
});
