// process.env.NODE_ENV = 'test'; // Commented out to use Dev DB

const app = require('./app');
const { sequelize } = require('./config/database');
const { User } = require('./models');
const http = require('http');

const PORT = 3003;
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
        const testUserEmail = `id_user_${uniqueSuffix}@test.com`;

        // 1. Signup New User
        console.log('\n--- 1. Testing Signup ---');
        const resSignup = await fetch(`${baseUrl}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'ID Tester',
                email: testUserEmail,
                password: 'password123',
                passwordConfirm: 'password123'
            })
        });
        const dataSignup = await resSignup.json();

        if (resSignup.status !== 201) {
            console.error('❌ Failed: Signup failed.', dataSignup);
            process.exit(1);
        }
        console.log('✅ Passed: Signup successful.');
        const token = dataSignup.token;

        // 2. Update Profile with ID Fields
        console.log('\n--- 2. Testing Update Profile with ID fields ---');
        const idData = {
            idType: 'National ID',
            idNumber: '1234567890',
            idImage: 'https://example.com/id_image.jpg'
        };

        const resUpdate = await fetch(`${baseUrl}/users/update-profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(idData)
        });
        const dataUpdate = await resUpdate.json();

        if (resUpdate.status === 200) {
            console.log('✅ Passed: Update endpoint returned 200.');
            const user = dataUpdate.data.user;

            // Verify Fields
            if (user.idType === idData.idType &&
                user.idNumber === idData.idNumber &&
                user.idImage === idData.idImage) {
                console.log('✅ Passed: ID fields updated correctly.');
            } else {
                console.error('❌ Failed: ID fields mismatch.', user);
                process.exit(1);
            }

        } else {
            console.error('❌ Failed: Update request failed.', dataUpdate);
            process.exit(1);
        }

        console.log('\n🎉 ALL ID PROFILE TESTS PASSED SUCCESSFULLY! 🎉');

    } catch (error) {
        console.error('Test Execution Error:', error);
    } finally {
        if (server) server.close();
        process.exit(0);
    }
}

runTests();
