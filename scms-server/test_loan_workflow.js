const { Loan, Account, Transaction, User, sequelize } = require('./models');
const { applyForLoan, reviewLoan, disburseLoan } = require('./controllers/loanController');
const fs = require('fs');

async function testLoanWorkflow() {
    try {
        console.log('\\n=== Testing Loan Workflow ===\\n');

        // 1. Setup users
        const [staff] = await User.findOrCreate({
            where: { email: 'staff@scms.com' },
            defaults: { name: 'Test Staff', email: 'staff@scms.com', password: 'password123', role: 'staff', status: 'active' }
        });

        const [member] = await User.findOrCreate({
            where: { email: 'member@scms.com' },
            defaults: { name: 'Test Member', email: 'member@scms.com', password: 'password123', role: 'member', status: 'active' }
        });

        const [account] = await Account.findOrCreate({
            where: { userId: member.id, accountType: 'savings' },
            defaults: { userId: member.id, accountNumber: 'ACC-SAV-TEST', accountType: 'savings', balance: 100, status: 'active' }
        });

        const staffUser = staff.get({ plain: true });
        const memberUser = member.get({ plain: true });

        console.log(`✅ Users & Account Ready (Member ID: ${member.id})\\n`);

        // 2. Apply for Loan
        console.log('2. Applying for Loan...');
        let loan;
        const req = { user: memberUser, body: { loanAmount: 5000, duration: 6 } };
        const res = {
            status: (code) => ({
                json: (data) => {
                    if (code === 201) loan = data.data.loan;
                    return data;
                }
            })
        };

        await applyForLoan(req, res, (err) => { if (err) throw err; });
        console.log(`✅ Loan applied: ID ${loan.id}, Monthly Payment: ${loan.monthlyPayment}\\n`);

        // 3. Review Loan
        console.log('3. Approving Loan...');
        const reviewReq = { user: staffUser, params: { id: loan.id }, body: { status: 'approved' } };
        await reviewLoan(reviewReq, res, (err) => { if (err) throw err; });
        console.log(`✅ Loan set to approved\\n`);

        // 4. Disburse Loan
        console.log('4. Disbursing Loan...');
        const disburseReq = { user: staffUser, params: { id: loan.id } };
        await disburseLoan(disburseReq, {
            status: () => ({ json: (d) => console.log(`   Response: ${d.message}`) })
        }, (err) => { if (err) throw err; });

        const updatedLoan = await Loan.findByPk(loan.id);
        const updatedAccount = await Account.findByPk(account.id);
        console.log(`✅ Loan Final Status: ${updatedLoan.status}`);
        console.log(`✅ Final Account Balance: ${updatedAccount.balance}\\n`);

        console.log('=== Loan Workflow Test Completed Successfully! ===\\n');
    } catch (error) {
        console.error('❌ Test Failed!');
        console.error('Error:', error.message);
        if (error.errors) error.errors.forEach(e => console.error('Details:', e.message));
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

testLoanWorkflow();
