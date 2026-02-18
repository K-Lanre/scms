// using native fetch
// If node version is recent, we can use global fetch.

async function testProfile() {
    const baseUrl = 'http://localhost:3000/api/v1/users';

    console.log('--- Testing Profile ---');
    try {
        console.log('\n--- Testing Login ---');
        const loginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin_1770982720963@scms.com',
                password: 'password123'
            })
        });

        // Check if response is JSON
        const loginContentType = loginRes.headers.get('content-type');
        if (!loginContentType || !loginContentType.includes('application/json')) {
            const loginText = await loginRes.text();
            console.log('Login Status:', loginRes.status);
            console.log('Login Response (not JSON):', loginText.substring(0, 500));
            console.log('❌ Server returned non-JSON response. Is the server running on port 3000?');
            return;
        }

        const rawText = await loginRes.text();
        let loginData;
        try {
            loginData = JSON.parse(rawText);
        } catch (e) {
            console.log('Login Status:', loginRes.status);
            console.log('Login Headers:', [...loginRes.headers.entries()]);
            console.log('❌ Failed to parse JSON. Raw Response:', rawText.substring(0, 1000));
            return;
        }

        console.log('Login Status:', loginRes.status);
        console.log('Login Data:', loginData);

        if (loginData.status === 'success' && loginData.token) {
            console.log('✅ Login Successful');
        } else {
            console.log('❌ Login Failed');
        }

        if (loginData.status === 'success') {

            const profileRes = await fetch(`${baseUrl}/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginData.token}`
                },
            });

            // Check if response is JSON
            const profileContentType = profileRes.headers.get('content-type');
            if (!profileContentType || !profileContentType.includes('application/json')) {
                const profileText = await profileRes.text();
                console.log('Profile Status:', profileRes.status);
                console.log('Profile Response (not JSON):', profileText.substring(0, 500));
                console.log('❌ Server returned non-JSON response for profile.');
                return;
            }

            const profileData = await profileRes.json();
            console.log('Profile Status:', profileRes.status);
            console.log('Profile Data:', profileData);
            console.log('✅ Profile Successful');
        } else {
            console.log('❌ Profile Failed');
        }


    } catch (error) {
        console.error('Test Error:', error);
    }
}

testProfile();
