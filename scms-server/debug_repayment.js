const { Loan, LoanRepayment, Transaction, User, Account, sequelize } = require('./models');

async function debugRepayment() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        const loan = await Loan.findOne({ where: { status: 'disbursed' } });
        const user = await User.findByPk(loan.userId);
        const account = await Account.findOne({ where: { userId: user.id } });

        console.log(`Loan ID: ${loan.id}, User ID: ${user.id}, Account ID: ${account.id}`);

        const t = await sequelize.transaction();
        try {
            console.log('Creating Transaction record...');
            const txn = await Transaction.create({
                accountId: account.id,
                transactionType: 'loan_repayment',
                amount: 100.00,
                balanceAfter: 5000.00,
                reference: 'TEST-REF-' + Date.now(),
                description: 'Test repayment',
                performedBy: user.id,
                status: 'completed',
                completedAt: new Date()
            }, { transaction: t });

            console.log('Creating LoanRepayment record...');
            await LoanRepayment.create({
                loanId: loan.id,
                transactionId: txn.id,
                amount: 100.00,
                principal: 80.00,
                interest: 20.00,
                paidAt: new Date()
            }, { transaction: t });

            console.log('Updating Loan...');
            await loan.update({
                outstandingBalance: 4000.00,
                status: 'repaying'
            }, { transaction: t });

            await t.commit();
            console.log('Success!');
        } catch (err) {
            await t.rollback();
            throw err;
        }
    } catch (error) {
        console.error('Error:', error.message);
        console.error(error.stack);
    } finally {
        await sequelize.close();
    }
}

debugRepayment();
