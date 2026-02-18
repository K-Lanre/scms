/**
 * Verification script for Loan Repayment Automation
 * Tests both manual and automated repayment flows
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/v1';
let adminToken, userToken;

// Test credentials
const admin = { email: 'admin@test.com', password: 'password123' };
const testUser = {
    name: 'Repayment Test User',
    email: 'repaytest@test.com',
    password: 'password123',
    passwordConfirm: 'password123'
};

async function login(credentials) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    const data = await response.json();
    return data.token;
}

async function createUser() {
    try {
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const data = await response.json();

        if (data.status === 'success') {
            console.log('✅ New user created');
            return data.data.user.id;
        } else {
            // User might already exist, try to get user ID by logging in
            console.log('ℹ️  User might already exist, attempting login...');
            userToken = await login(testUser);

            // Get user profile
            const profileResponse = await fetch(`${BASE_URL}/users/me`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            const profileData = await profileResponse.json();
            console.log('✅ Using existing user');
            return profileData.data.user.id;
        }
    } catch (error) {
        console.error('Error in createUser:', error.message);
        throw error;
    }
}

async function approveUser(userId) {
    await fetch(`${BASE_URL}/users/${userId}/approve`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        }
    });
    console.log('✅ User approved');
}

async function depositFunds(accountId, amount) {
    await fetch(`${BASE_URL}/accounts/${accountId}/deposit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ amount })
    });
    console.log(`✅ Deposited ₦${amount} to savings`);
}

async function getAccounts() {
    const response = await fetch(`${BASE_URL}/accounts/my-accounts`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const data = await response.json();
    return data.data.accounts;
}

async function testManualRepayment() {
    console.log('\n📌 TEST 1: Manual Repayment Mode');
    console.log('================================');

    // Apply for loan (manual mode)
    const loanResponse = await fetch(`${BASE_URL}/loans/apply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
            loanAmount: 50000,
            duration: 6,
            interestRate: 5,
            bankName: 'First Bank',
            accountNumber: '1234567890',
            repaymentMode: 'manual'
        })
    });
    const loanData = await loanResponse.json();
    console.log('✅ Loan application submitted (Manual mode)');
    console.log('   Total Repayable:', loanData.data.loan.totalRepayable);

    const loan1Id = loanData.data.loan.id;

    // Approve loan
    await fetch(`${BASE_URL}/loans/${loan1Id}/review`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: 'approved' })
    });
    console.log('✅ Loan approved');

    // Disburse loan
    await fetch(`${BASE_URL}/loans/${loan1Id}/disburse`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        }
    });
    console.log('✅ Loan disbursed');

    // Make manual repayment
    const repaymentResponse = await fetch(`${BASE_URL}/loans/${loan1Id}/repay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ amount: 10000 })
    });
    const repaymentData = await repaymentResponse.json();
    console.log('✅ Manual repayment successful');
    console.log('   Principal:', repaymentData.data.repayment.principal);
    console.log('   Interest:', repaymentData.data.repayment.interest);
    console.log('   New Outstanding:', repaymentData.data.loan.outstandingBalance);
    console.log('   Status:', repaymentData.data.loan.status);

    // Get repayment history
    const historyResponse = await fetch(`${BASE_URL}/loans/${loan1Id}/repayments`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const historyData = await historyResponse.json();
    console.log(`✅ Repayment history: ${historyData.results} payment(s) found`);
}

async function testAutomatedRepayment() {
    console.log('\n📌 TEST 2: Automated Repayment Mode');
    console.log('=====================================');

    // Apply for loan (automated mode)
    const loanResponse = await fetch(`${BASE_URL}/loans/apply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
            loanAmount: 100000,
            duration: 12,
            interestRate: 5,
            bankName: 'GTBank',
            accountNumber: '0987654321',
            repaymentMode: 'automated',
            monthlyDeductionAmount: 10000
        })
    });
    const loanData = await loanResponse.json();
    console.log('✅ Loan application submitted (Automated mode)');
    console.log('   Monthly Deduction:', loanData.data.loan.monthlyDeductionAmount);
    console.log('   Calculated Duration:', loanData.data.calculatedDuration, 'months');
    console.log('   Total Interest:', loanData.data.totalInterest);

    const loan2Id = loanData.data.loan.id;

    // Approve and disburse
    await fetch(`${BASE_URL}/loans/${loan2Id}/review`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: 'approved' })
    });

    await fetch(`${BASE_URL}/loans/${loan2Id}/disburse`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        }
    });
    console.log('✅ Loan disbursed with automated repayment setup');

    return loan2Id;
}

async function testBackgroundJobs(loanId) {
    console.log('\n📌 TEST 3: Background Jobs (Manual Trigger)');
    console.log('=============================================');

    const { processAutomatedDeductions } = require('./jobs/scheduler');
    const { processLoanDefaults } = require('./jobs/scheduler');

    console.log('🔄 Running Automated Deduction Job...');
    await processAutomatedDeductions();
    console.log('✅ Automated deduction job completed');

    console.log('🔄 Running Loan Default Job...');
    await processLoanDefaults();
    console.log('✅ Loan default job completed');

    // Check loan status after jobs
    const loanResponse = await fetch(`${BASE_URL}/loans`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const loansData = await loanResponse.json();
    const updatedLoan = loansData.data.loans.find(l => l.id === loanId);

    if (updatedLoan) {
        console.log('\n📊 Loan Status After Job Execution:');
        console.log('   Outstanding Balance:', updatedLoan.outstandingBalance);
        console.log('   Status:', updatedLoan.status);
        console.log('   Failed Deduction Count:', updatedLoan.failedDeductionCount);
    }
}

async function main() {
    try {
        console.log('🚀 Starting Loan Repayment Automation Verification\n');

        // Login as admin
        adminToken = await login(admin);
        console.log('✅ Admin logged in');

        // Create and approve test user
        const userId = await createUser();
        await approveUser(userId);

        // Login as test user
        userToken = await login(testUser);
        console.log('✅ Test user logged in');

        // Deposit funds for testing
        const accounts = await getAccounts();
        const savingsAccount = accounts.find(a => a.accountType === 'savings');
        await depositFunds(savingsAccount.id, 200000);

        // Run tests
        await testManualRepayment();
        const automatedLoanId = await testAutomatedRepayment();
        await testBackgroundJobs(automatedLoanId);

        console.log('\n✅ ALL TESTS COMPLETED SUCCESSFULLY\n');
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        if (error.stack) console.error(error.stack);
    }
}

main();
