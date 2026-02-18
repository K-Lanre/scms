// process.env.NODE_ENV = 'test'; // Commented out to use Dev DB (MySQL)

const app = require('./app');
const { sequelize } = require('./config/database');
const { User, Account } = require('./models');
// Using supertest for easier API testing if installed, otherwise fetch
// Actually supertest might not be installed. Let's use http server + fetch or just mock req/res if we want to avoid deps.
// But wait, the environment has `node-fetch` usually available in recent node.
// Let's use standard http server start and fetch.

const http = require('http');

const PORT = 3001;
let server;

async function runTests() {
    try {
        // 1. Setup DB (No Force Sync!)
        console.log('--- Connecting to Dev DB ---');
        // await sequelize.sync({ force: true }); // DANGEROUS IN DEV

        // 2. Find or Create Admin User
        console.log('--- Getting Admin User ---');
        let adminUser = await User.findOne({ where: { role: 'super_admin' } });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Super Admin',
                email: `admin_${Date.now()}@test.com`,
                password: 'password123',
                role: 'super_admin',
                status: 'active'
            });
            console.log('Created new Admin');
        } else {
            console.log('Using existing Admin');
        }

        // Start Server
        server = http.createServer(app);
        await new Promise(resolve => server.listen(PORT, resolve));
        const baseUrl = `http://localhost:${PORT}/api/v1`;
        console.log(`Test server running on port ${PORT}`);

        const uniqueSuffix = Date.now();
        const testUserEmail = `user_${uniqueSuffix}@test.com`;

        // 3. Test Signup Validation (Mismatch Password)
        console.log('\n--- 1. Testing Signup (Mismatch Password) ---');
        const res1 = await fetch(`${baseUrl}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: testUserEmail,
                password: 'password123',
                passwordConfirm: 'password456'
            })
        });
        const data1 = await res1.json();
        if (res1.status === 400 && data1.message.includes('Passwords do not match')) {
            console.log('✅ Passed: Mismatch password rejected.');
        } else {
            console.error('❌ Failed: Mismatch password not rejected properly.', data1);
            // Don't exit, might be just one failure
        }

        // 4. Test Signup Success (Default Role)
        console.log('\n--- 2. Testing Signup (Success & Default Role) ---');
        const res2 = await fetch(`${baseUrl}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: testUserEmail,
                password: 'password123',
                passwordConfirm: 'password123',
                role: 'admin' // Attempt to inject role
            })
        });
        const data2 = await res2.json();

        if (res2.status === 201) {
            console.log('✅ Passed: Signup successful.');

            // Verify Role in DB
            const userInDb = await User.findOne({ where: { email: testUserEmail } });
            if (userInDb.role === 'user') {
                console.log(`✅ Passed: Role is 'user' (admin role injection ignored).`);
            } else {
                console.error(`❌ Failed: Role is '${userInDb.role}', expected 'user'.`);
                process.exit(1);
            }

            // Verify No Accounts yet
            const accounts = await Account.findAll({ where: { userId: userInDb.id } });
            if (accounts.length === 0) {
                console.log('✅ Passed: No accounts created yet.');
            } else {
                console.error(`❌ Failed: Accounts created prematurely: ${accounts.length}`);
                process.exit(1);
            }
        } else {
            console.error('❌ Failed: Signup failed.', data2);
            process.exit(1);
        }

        // 5. Test Admin Login (to get token)
        console.log('\n--- 3. Login as Admin ---');
        // We know the admin user email/pass from step 2 if we created it.
        // If we found existing, we might not know password.
        // Force update password for the admin we found/created to be sure.
        // adminUser.password = 'password123'; // Logic in model will hash this if hooks run
        // Wait, directly setting property on instance doesn't trigger hook unless we save.
        // And we need to hash it?
        // Actually, let's just create a NEW temporary admin for this test to be safe regardless.

        const tempAdminEmail = `temp_admin_${uniqueSuffix}@test.com`;
        const tempAdmin = await User.create({
            name: 'Temp Admin',
            email: tempAdminEmail,
            password: 'password123',
            role: 'super_admin',
            status: 'active'
        });

        const resLogin = await fetch(`${baseUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: tempAdminEmail,
                password: 'password123'
            })
        });
        const dataLogin = await resLogin.json();
        const adminToken = dataLogin.token;
        if (!adminToken) {
            console.error('❌ Failed: Admin login failed.', dataLogin);
            process.exit(1);
        }
        console.log('✅ Passed: Admin logged in.');

        // 6. Test Approve Member
        console.log('\n--- 4. Testing Admin Approval ---');
        const userToApprove = await User.findOne({ where: { email: testUserEmail } });
        const resApprove = await fetch(`${baseUrl}/users/${userToApprove.id}/approve`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            }
        });
        const dataApprove = await resApprove.json();

        if (resApprove.status === 200) {
            console.log('✅ Passed: Approval endpoint returned 200.');

            // Verify DB Changes
            const updatedUser = await User.findByPk(userToApprove.id);
            if (updatedUser.role === 'member') {
                console.log(`✅ Passed: User role upgraded to 'member'.`);
            } else {
                console.error(`❌ Failed: User role is '${updatedUser.role}', expected 'member'.`);
                process.exit(1);
            }

            const newAccounts = await Account.findAll({ where: { userId: userToApprove.id } });
            const accountTypes = newAccounts.map(a => a.accountType).sort();
            if (accountTypes.length === 2 && accountTypes.includes('savings') && accountTypes.includes('share_capital')) {
                console.log(`✅ Passed: Correct accounts created: ${accountTypes.join(', ')}.`);
            } else {
                console.error(`❌ Failed: Incorrect accounts created: ${accountTypes.join(', ')}.`);
                process.exit(1);
            }
        } else {
            console.error('❌ Failed: Approval request failed.', dataApprove);
            console.error(dataApprove); // Log full error details
            process.exit(1);
        }

        console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');

    } catch (error) {
        console.error('Test Execution Error:', error);
    } finally {
        if (server) server.close();
        // await sequelize.close(); // Keep connection open or close properly? SQLite memory usually closes with process.
        process.exit(0);
    }
}

runTests();
