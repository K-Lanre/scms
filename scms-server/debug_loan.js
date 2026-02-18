const { Loan, User, sequelize } = require('./models');

async function debugLoan() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        const user = await User.findOne();
        if (!user) {
            console.log('No user found');
            return;
        }

        console.log(`Creating loan for user ${user.id}...`);
        const loan = await Loan.create({
            userId: user.id,
            loanAmount: 1000.00,
            interestRate: 2.00,
            duration: 12,
            monthlyPayment: 100.00,
            totalRepayable: 1200.00,
            outstandingBalance: 1200.00,
            status: 'pending'
        });

        console.log('Loan created successfully:', loan.id);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.errors) {
            error.errors.forEach(e => console.error('Details:', e.message));
        }
    } finally {
        await sequelize.close();
    }
}

debugLoan();
