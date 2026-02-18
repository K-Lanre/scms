const http = require('http');
const app = require('./app');
const { User, Loan, sequelize } = require('./models');

const PORT = 3006;
let server;
let adminToken;
let userToken;
let loanId;

async function runTests() {
    try {
        console.log('--- Connecting to Dev DB ---');
        server = http.createServer(app);
        await new Promise(resolve => server.listen(PORT, resolve));
        const baseUrl = `http://localhost:${PORT}/api/v1`;
        console.log(`Test server running on port ${PORT}`);

        // Helper to login
        const login = async (email, password) => {
            const res = await fetch(`${baseUrl}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            return data.token;
        };

        // 1. Login as Admin and User
        // Assuming 'admin@scms.com' and 'newuser@example.com' exist from previous steps or seeds
        // If not, we might need to create them. 
        // Let's create a fresh Admin and User to be safe.

        // Create Admin
        const adminEmail = `admin_loan_${Date.now()}@test.com`;
        await User.create({
            name: 'Loan Admin',
            email: adminEmail,
            password: 'password123',
            role: 'super_admin',
            status: 'active'
        });
        adminToken = await login(adminEmail, 'password123');
        console.log('✅ Admin Logged In');

        // Create User
        const userEmail = `user_loan_${Date.now()}@test.com`;
        const user = await User.create({
            name: 'Loan Borrower',
            email: userEmail,
            password: 'password123',
            role: 'member', // Member to apply
            status: 'active',
            bankName: 'Test Bank',
            accountNumber: '1234567890'
        });
        userToken = await login(userEmail, 'password123');
        console.log('✅ User Logged In');

        // 2. User Applies for Loan
        console.log('\n--- 2. User Applying for Loan ---');
        const applyRes = await fetch(`${baseUrl}/loans/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                loanAmount: 50000,
                duration: 6,
                bankName: 'Access Bank',
                accountNumber: '0011223344'
            })
        });
        const applyData = await applyRes.json();
        if (applyRes.status === 201) {
            console.log('✅ Loan Application Successful');
            loanId = applyData.data.loan.id;
        } else {
            console.error('❌ Loan Application Failed:', applyData);
            process.exit(1);
        }

        // 3. Admin Reviews (Approves) Loan
        console.log('\n--- 3. Admin Approving Loan ---');
        const approveRes = await fetch(`${baseUrl}/loans/${loanId}/review`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                status: 'approved'
            })
        });
        if (approveRes.status === 200) {
            console.log('✅ Loan Approved');
        } else {
            const err = await approveRes.json();
            console.error('❌ Loan Approval Failed:', err);
            process.exit(1);
        }

        // 4. Admin Disburses Loan (Triggers Paystack Transfer)
        console.log('\n--- 4. Admin Disbursing Loan ---');
        const disburseRes = await fetch(`${baseUrl}/loans/${loanId}/disburse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            }
        });
        const disburseData = await disburseRes.json();

        if (disburseRes.status === 200) {
            console.log('✅ Loan Disbursed Successfully');
            console.log('   Reference:', disburseData.data.reference);
            console.log('   Recipient:', disburseData.data.recipient);
        } else {
            console.error('❌ Loan Disbursement Failed:', disburseData);
            process.exit(1);
        }

        // Verify Loan Status in DB
        const updatedLoan = await Loan.findByPk(loanId);
        if (updatedLoan.status === 'disbursed' && updatedLoan.paystackTransferRecipient) {
            console.log('✅ DB Verification Passed: Loan is Disbursed');
        } else {
            console.error('❌ DB Verification Failed:', updatedLoan.dataValues);
        }

        console.log('\n🎉 ALL LOAN DISBURSEMENT TESTS PASSED! 🎉');

    } catch (err) {
        console.error('Test Execution Error:', err);
    } finally {
        if (server) server.close();
        process.exit(0);
    }
}

runTests();
