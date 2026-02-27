const { User, Account, Loan, UserSavingsPlan, Transaction, sequelize } = require('../models');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');

/**
 * Get statistics for the dashboard based on user role
 */
exports.getDashboardStats = catchAsync(async (req, res, next) => {
    const { role, id: userId } = req.user;
    const isAdmin = ['admin', 'super_admin', 'staff'].includes(role);

    if (isAdmin) {
        // 1. Total Members
        const totalMembers = await User.count({ where: { role: 'member' } });

        // 2. Total Disbursed Loans (Principal)
        const loansVolume = await Loan.sum('loanAmount', {
            where: { status: { [Op.in]: ['disbursed', 'repaying', 'defaulted'] } }
        }) || 0;

        // 3. Pending Requests (Registrations + Loans + Withdrawals)
        const pendingLoans = await Loan.count({ where: { status: 'pending' } });
        const pendingRegistrations = await User.count({ where: { status: 'pending_approval' } });
        const pendingWithdrawals = 0; // Placeholder for now

        // 4. Defaulters
        const defaultersCount = await Loan.count({ where: { status: 'defaulted' } });

        res.status(200).json({
            status: 'success',
            data: {
                totalMembers: totalMembers.toLocaleString(),
                totalLoansVolume: `₦${(loansVolume / 1000000).toFixed(1)}M`,
                pendingActions: pendingLoans + pendingRegistrations + pendingWithdrawals,
                defaulters: defaultersCount,
                role: 'admin'
            }
        });
    } else {
        // Member Stats
        const savingsAccount = await Account.findOne({
            where: { userId, accountType: 'savings' }
        });

        const loanAccount = await Loan.findOne({
            where: { userId, status: { [Op.in]: ['disbursed', 'repaying', 'defaulted'] } },
            attributes: [[sequelize.fn('SUM', sequelize.col('outstandingBalance')), 'total']]
        });

        const shareAccount = await Account.findOne({
            where: { userId, accountType: 'share_capital' }
        });

        const recentTransactions = await Transaction.findAll({
            where: { userId },
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            data: {
                mySavings: `₦${parseFloat(savingsAccount?.balance || 0).toLocaleString()}`,
                loanBalance: `₦${parseFloat(loanAccount?.dataValues.total || 0).toLocaleString()}`,
                shares: `${parseFloat(shareAccount?.balance || 0).toLocaleString()} units`,
                recentTransactions,
                role: 'member'
            }
        });
    }
});

/**
 * Get time-series data for dashboard charts (Last 6 Months)
 */
exports.getChartData = catchAsync(async (req, res, next) => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push(d.toLocaleString('default', { month: 'short' }));
    }

    // Aggregate real data: Savings (Transactions) and Loans (Original Amounts)
    const chartData = await Promise.all(months.map(async (month, index) => {
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() - (5 - index));
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);

        // Sum Savings Transactions (Credit only)
        const savingsVolume = await Transaction.sum('amount', {
            where: {
                transactionType: { [Op.in]: ['deposit', 'savings_contribution'] },
                createdAt: { [Op.between]: [monthStart, monthEnd] }
            }
        }) || 0;

        // Sum Loan Principal Disbursed
        const loansVolume = await Loan.sum('loanAmount', {
            where: {
                status: { [Op.in]: ['disbursed', 'repaying', 'completed'] },
                createdAt: { [Op.between]: [monthStart, monthEnd] }
            }
        }) || 0;

        return {
            name: month,
            savings: parseFloat(savingsVolume),
            loans: parseFloat(loansVolume)
        };
    }));

    res.status(200).json({
        status: 'success',
        data: chartData
    });
});
