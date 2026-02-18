const { Loan, Account, Transaction, User, sequelize, LoanRepayment } = require('./models');
const { applyForLoan, reviewLoan, disburseLoan } = require('./controllers/loanController');
const { makeRepayment } = require('./controllers/repaymentController');

async function testFullLoanLifecycle() {
    try {
        console.log('\\n=== Testing Full Loan Lifecycle (Apply -> Approve -> Disburse -> Repay) ===\\n');

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
            defaults: { userId: member.id, accountNumber: 'ACC-SAV-FINAL', accountType: 'savings', balance: 1000, status: 'active' }
        });

        const staffUser = staff.get({ plain: true });
        const memberUser = member.get({ plain: true });

        console.log(`✅ Ready: Member ID ${member.id}, Account Balance: ${account.balance}\\n`);

        // 2. Apply
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
        console.log(`✅ 1. Loan Applied. ID: ${loan.id}, Total Repayable: ${loan.totalRepayable}`);

        // 3. Approve
        await reviewLoan({ user: staffUser, params: { id: loan.id }, body: { status: 'approved' } }, res, (err) => { if (err) throw err; });
        console.log(`✅ 2. Loan Approved`);

        // 4. Disburse
        await disburseLoan({ user: staffUser, params: { id: loan.id } }, { status: () => ({ json: () => { } }) }, (err) => { if (err) throw err; });
        await account.reload();
        console.log(`✅ 3. Loan Disbursed. New Account Balance: ${account.balance}`);

        // 5. Repay
        console.log('5. Making partial repayment (1000)...');
        const repayReq = { user: memberUser, params: { id: loan.id }, body: { amount: 1000 } };
        const repayRes = {
            status: (code) => ({
                json: (data) => {
                    console.log(`   Repayment status: ${data.status}`);
                    console.log(`   Principal: ${data.data.repayment.principal}, Interest: ${data.data.repayment.interest}`);
                    return data;
                }
            })
        };
        await makeRepayment(repayReq, repayRes, (err) => { if (err) throw err; });

        const finalLoan = await Loan.findByPk(loan.id);
        const finalAccount = await Account.findByPk(account.id);
        const repaymentRecord = await LoanRepayment.findOne({ where: { loanId: loan.id } });

        console.log(`✅ 4. Repayment Recorded.`);
        console.log(`✅ Outstanding Balance: ${finalLoan.outstandingBalance}`);
        console.log(`✅ Account Balance After Repay: ${finalAccount.balance}`);
        console.log(`✅ Repayment Record Found: ID ${repaymentRecord.id}\\n`);

        console.log('=== Full Loan Lifecycle Test Successful! ===\\n');
    } catch (error) {
        console.error('❌ Test Failed!');
        console.error('Error:', error.message);
        if (error.errors) error.errors.forEach(e => console.error('Details:', e.message));
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

testFullLoanLifecycle();
