// process.env.NODE_ENV = 'test';
process.env.PAYSTACK_SECRET_KEY = 'mock_secret'; // Set mock secret for testing

const app = require('./app');
const { sequelize } = require('./config/database');
const { User, Account, Transaction } = require('./models');
const http = require('http');
const crypto = require('crypto');

const PORT = 3004;
let server;

async function runTests() {
    try {
        console.log('--- Connecting to Dev DB ---');

        // Start Server
        server = http.createServer(app);
        await new Promise(resolve => server.listen(PORT, resolve));
        const baseUrl = `http://localhost:${PORT}/api/v1`;
        console.log(`Test server running on port ${PORT}`);

        const uniqueSuffix = Date.now();
        const testUserEmail = `paystack_user_${uniqueSuffix}@test.com`;

        // 1. Signup New User
        console.log('\n--- 1. Testing Signup ---');
        const resSignup = await fetch(`${baseUrl}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Paystack Tester',
                email: testUserEmail,
                password: 'password123',
                passwordConfirm: 'password123'
            })
        });
        const dataSignup = await resSignup.json();
        const userId = dataSignup.data.user.id;
        console.log(`✅ Passed: Signup successful (User ID: ${userId}).`);

        // 2. Approve Member (Triggers Paystack Customer & DVA Mock)
        console.log('\n--- 2. Testing Approval & Paystack Integration ---');

        // Mock Admin Token (we need a real one for restrictTo)
        // Let's just create a temp admin for this test
        const tempAdminEmail = `admin_paystack_${uniqueSuffix}@test.com`;
        const tempAdmin = await User.create({
            name: 'Paystack Admin',
            email: tempAdminEmail,
            password: 'password123',
            role: 'super_admin'
        });

        const loginRes = await fetch(`${baseUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: tempAdminEmail, password: 'password123' })
        });
        const { token: adminToken } = await loginRes.json();

        const resApprove = await fetch(`${baseUrl}/users/${userId}/approve`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            }
        });
        const dataApprove = await resApprove.json();

        if (resApprove.status === 200) {
            const user = await User.findByPk(userId);
            const savingsAccount = await Account.findOne({ where: { userId, accountType: 'savings' } });

            if (user.paystackCustomerCode && user.paystackCustomerCode.startsWith('mock_cust')) {
                console.log('✅ Passed: Paystack Customer Code generated (Mock).');
            } else {
                console.error('❌ Failed: Paystack Customer Code missing.');
                process.exit(1);
            }

            if (savingsAccount.paystackDedicatedAccountNumber) {
                console.log(`✅ Passed: Paystack DVA assigned: ${savingsAccount.paystackDedicatedAccountNumber} (${savingsAccount.paystackDedicatedAccountBank})`);
            } else {
                console.error('❌ Failed: Paystack DVA missing.');
                process.exit(1);
            }
        } else {
            console.error('❌ Failed: Approval failed.', dataApprove);
            process.exit(1);
        }

        // 3. Test Webhook (Credit Account)
        console.log('\n--- 3. Testing Paystack Webhook ---');
        const mockWebhookBody = {
            event: 'charge.success',
            data: {
                amount: 500000, // 5000 Naira in kobo
                currency: 'NGN',
                reference: `ref_${uniqueSuffix}`,
                channel: 'dedicated_virtual_account',
                customer: {
                    customer_code: (await User.findByPk(userId)).paystackCustomerCode,
                    email: testUserEmail
                }
            }
        };

        const resWebhook = await fetch(`${baseUrl}/webhooks/paystack`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockWebhookBody)
        });

        if (resWebhook.status === 200) {
            console.log('✅ Passed: Webhook endpoint returned 200.');

            // Verify Account Balance
            const account = await Account.findOne({ where: { userId, accountType: 'savings' } });
            if (parseFloat(account.balance) === 5000) {
                console.log('✅ Passed: Account balance updated correctly (+5000).');
            } else {
                console.error(`❌ Failed: Balance mismatch. Expected 5000, got ${account.balance}`);
                process.exit(1);
            }

            // Verify Transaction record
            const tx = await Transaction.findOne({ where: { accountId: account.id } });
            if (tx && tx.amount == 5000) {
                console.log(`✅ Passed: Transaction record created: ${tx.reference}`);
            } else {
                console.error('❌ Failed: Transaction record missing or incorrect.');
                process.exit(1);
            }
        } else {
            console.error('❌ Failed: Webhook request failed.', await resWebhook.text());
            process.exit(1);
        }

        console.log('\n🎉 ALL PAYSTACK INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');

    } catch (error) {
        console.error('Test Execution Error:', error);
    } finally {
        if (server) server.close();
        process.exit(0);
    }
}

runTests();
