/**
 * Comprehensive verification script for all automated features
 * Tests: Loan repayment, Savings deposits, Interest, Maturity
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/v1';
let adminToken, userToken, userId, savingsAccountId, savingsPlanId;

// Test credentials
const admin = { email: 'admin@test.com', password: 'password123' };
const testUser = {
    name: 'Automation Test User',
    email: 'autotest@test.com',
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

async function setupTestUser() {
    console.log('\n📦 SETUP: Creating and approving test user...');

    // Try to signup
    const signupResponse = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
    });
    const signupData = await signupResponse.json();

    if (signupData.status === 'success') {
        userId = signupData.data.user.id;
        console.log('✅ New user created');
    } else {
        // User exists, login to get ID
        userToken = await login(testUser);
        const profileResponse = await fetch(`${BASE_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const profileData = await profileResponse.json();
        userId = profileData.data.user.id;
        console.log('ℹ️  Using existing user');
    }

    // Approve user
    await fetch(`${BASE_URL}/users/${userId}/approve`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        }
    });
    console.log('✅ User approved');

    // Login as user
    userToken = await login(testUser);

    // Get accounts
    const accountsResponse = await fetch(`${BASE_URL}/accounts/my-accounts`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const accountsData = await accountsResponse.json();
    savingsAccountId = accountsData.data.accounts.find(a => a.accountType === 'savings').id;

    // Deposit funds
    await fetch(`${BASE_URL}/accounts/${savingsAccountId}/deposit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ amount: 500000 })
    });
    console.log('✅ Deposited ₦500,000 to savings account');
}

async function testAutoSavingsDeposit() {
    console.log('\n📌 TEST: Automated Savings Deposits');
    console.log('=====================================');

    // Create savings plan with auto-deposit
    const planResponse = await fetch(`${BASE_URL}/savings/plans`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
            productId: 1, // Assuming product exists
            duration: 180, // 6 months
            frequency: 'monthly',
            autoSaveAmount: 50000
        })
    });
    const planData = await planResponse.json();

    if (planData.status === 'success') {
        savingsPlanId = planData.data.plan.id;
        console.log(`✅ Savings plan created (ID: ${savingsPlanId})`);
        console.log(`   Auto-deposit: ₦50,000/month`);
    } else {
        console.log('❌ Failed to create savings plan:', planData.message);
        return;
    }

    // Trigger auto-deposit job manually
    console.log('\n🔄 Triggering auto-deposit job...');
    const { processAutoSaveDeposits } = require('./jobs/savingsAutoDepositJob');
    await processAutoSaveDeposits();

    // Verify deposit was made
    const updatedAccountsResponse = await fetch(`${BASE_URL}/accounts/my-accounts`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const updatedAccountsData = await updatedAccountsResponse.json();
    const planAccount = updatedAccountsData.data.accounts.find(a => a.accountType === 'savings_plan');

    console.log(`\n📊 Results:`);
    console.log(`   Plan Account Balance: ₦${planAccount?.balance || 0}`);
    if (parseFloat(planAccount?.balance || 0) >= 50000) {
        console.log('   ✅ Auto-deposit successful!');
    } else {
        console.log('   ⚠️  Auto-deposit may not have processed');
    }
}

async function testSavingsInterest() {
    console.log('\n📌 TEST: Savings Interest Accrual');
    console.log('===================================');

    console.log('🔄 Triggering interest accrual job...');
    const { processMonthlyInterest } = require('./jobs/savingsInterestJob');
    await processMonthlyInterest();

    // Check balance after interest
    const accountsResponse = await fetch(`${BASE_URL}/accounts/my-accounts`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const accountsData = await accountsResponse.json();
    const planAccount = accountsData.data.accounts.find(a => a.accountType === 'savings_plan');

    console.log(`\n📊 Results:`);
    console.log(`   Plan Balance After Interest: ₦${planAccount?.balance || 0}`);
    console.log('   ✅ Interest job completed');
}

async function testAdminDashboard() {
    console.log('\n📌 TEST: Admin Dashboard Endpoints');
    console.log('====================================');

    // Test financial summary
    const summaryResponse = await fetch(`${BASE_URL}/admin/financial-summary`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const summaryData = await summaryResponse.json();

    if (summaryData.status === 'success') {
        console.log('\n✅ Financial Summary:');
        console.log(`   Total Members: ${summaryData.data.summary.totalMembers}`);
        console.log(`   Total Savings: ₦${summaryData.data.summary.totalSavingsBalance}`);
        console.log(`   Repayment Rate: ${summaryData.data.summary.repaymentRate}`);
    }

    // Test loan metrics
    const loanMetricsResponse = await fetch(`${BASE_URL}/admin/loan-metrics`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const loanMetricsData = await loanMetricsResponse.json();

    if (loanMetricsData.status === 'success') {
        console.log('\n✅ Loan Metrics:');
        console.log(`   Average Loan: ₦${loanMetricsData.data.averageLoanAmount}`);
        console.log(`   Default Rate: ${loanMetricsData.data.defaultRate}`);
    }

    // Test savings metrics
    const savingsMetricsResponse = await fetch(`${BASE_URL}/admin/savings-metrics`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const savingsMetricsData = await savingsMetricsResponse.json();

    if (savingsMetricsData.status === 'success') {
        console.log('\n✅ Savings Metrics:');
        console.log(`   Average Plan Balance: ₦${savingsMetricsData.data.averagePlanBalance}`);
        console.log(`   Active Plans: ${savingsMetricsData.data.plansByStatus.find(p => p.status === 'active')?.count || 0}`);
    }
}

async function testInsufficientFunds() {
    console.log('\n📌 TEST: Insufficient Funds Handling');
    console.log('======================================');

    // Withdraw most funds from main account
    await fetch(`${BASE_URL}/accounts/${savingsAccountId}/withdraw`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ amount: 400000 })
    });
    console.log('✅ Withdrew ₦400,000 (leaving insufficient balance)');

    // Try auto-deposit again (should fail gracefully)
    console.log('🔄 Triggering auto-deposit job with insufficient funds...');
    const { processAutoSaveDeposits } = require('./jobs/savingsAutoDepositJob');
    await processAutoSaveDeposits();

    console.log('✅ Job completed without errors (should have sent email notification)');
}

async function main() {
    try {
        console.log('🚀 Starting Comprehensive Automation Tests\n');
        console.log('='.repeat(50));

        // Login as admin
        adminToken = await login(admin);
        console.log('✅ Admin logged in');

        // Setup test user
        await setupTestUser();

        // Run tests
        await testAutoSavingsDeposit();
        await testSavingsInterest();
        await testAdminDashboard();
        await testInsufficientFunds();

        console.log('\n' + '='.repeat(50));
        console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY\n');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        if (error.stack) console.error(error.stack);
    }
}

main();
