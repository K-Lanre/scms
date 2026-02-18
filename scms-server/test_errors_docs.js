// using native fetch

async function testErrorHandlingAndDocs() {
    const baseUrl = 'http://localhost:3000';

    console.log('--- Testing 404 Error ---');
    try {
        const res = await fetch(`${baseUrl}/api/v1/unknown-route`);
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
        if (res.status === 404 && data.status === 'fail') {
            console.log('✅ 404 Error Handled Correctly');
        } else {
            console.log('❌ 404 Error Handling Failed');
        }
    } catch (error) {
        console.error('Test Error:', error);
    }

    console.log('\n--- Testing Swagger UI Access ---');
    try {
        const res = await fetch(`${baseUrl}/api-docs/`);
        console.log('Status:', res.status);
        if (res.status === 200) {
            console.log('✅ Swagger UI Accessible');
        } else {
            console.log('❌ Swagger UI Not Accessible');
        }
    } catch (error) {
        // console.error('Test Error:', error);
        console.log('❌ Swagger UI Not Accessible (Fetch Error)');
    }
}

testErrorHandlingAndDocs();
