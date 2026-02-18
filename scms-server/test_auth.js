// using native fetch
// If node version is recent, we can use global fetch.

async function testAuth() {
    const baseUrl = 'http://localhost:3000/api/v1/users';

    console.log('--- Testing Signup ---');
    try {
        const signupRes = await fetch(`${baseUrl}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Super Admin',
                email: `admin_${Date.now()}@scms.com`, // Unique email
                password: 'password123',
                role: 'super_admin'
            })
        });

        const signupData = await signupRes.json();
        console.log('Signup Status:', signupRes.status);
        console.log('Signup Data:', signupData);

        if (signupData.status === 'success') {
            console.log('✅ Signup Successful');
            const token = signupData.token;

            console.log('\n--- Testing Login ---');
            const loginRes = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: signupData.data.user.email,
                    password: 'password123'
                })
            });

            const loginData = await loginRes.json();
            console.log('Login Status:', loginRes.status);
            console.log('Login Data:', loginData);

            if (loginData.status === 'success' && loginData.token) {
                console.log('✅ Login Successful');
            } else {
                console.log('❌ Login Failed');
            }

        } else {
            console.log('❌ Signup Failed');
        }

    } catch (error) {
        console.error('Test Error:', error);
    }
}

testAuth();
