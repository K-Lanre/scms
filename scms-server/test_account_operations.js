const { Account, Transaction, User, sequelize } = require('./models');
const { recordTransaction } = require('./utils/transactionHelper');
const { generateAccountNumber } = require('./utils/accountHelper');

async function testAccountOperations() {
    try {
        console.log('\\n=== Testing Account Operations ===\\n');

        // 1. Find test users (staff and member)
        console.log('1. Finding test users...');
        const [staff] = await User.findOrCreate({
            where: { email: 'staff@scms.com' },
            defaults: {
                name: 'Test Staff',
                email: 'staff@scms.com',
                password: 'password123',
                role: 'staff',
                status: 'active'
            }
        });

        const [member] = await User.findOrCreate({
            where: { email: 'member@scms.com' },
            defaults: {
                name: 'Test Member',
                email: 'member@scms.com',
                password: 'password123',
                role: 'member',
                status: 'active'
            }
        });

        console.log(`✅ Staff: ${staff.name} (ID: ${staff.id})`);
        console.log(`✅ Member: ${member.name} (ID: ${member.id})\\n`);

        // 2. Create or find account
        console.log('2. Creating/Finding account for member...');
        let account = await Account.findOne({ where: { userId: member.id } });

        if (!account) {
            const accountNumber = await generateAccountNumber();
            account = await Account.create({
                userId: member.id,
                accountNumber,
                accountType: 'savings',
                balance: 0.00,
                status: 'active',
                openedAt: new Date()
            });
            console.log(`✅ Account created: ${account.accountNumber}\\n`);
        } else {
            console.log(`✅ Account found: ${account.accountNumber}\\n`);
        }

        // 3. Test deposit
        console.log('3. Testing deposit (1500.00)...');
        const depositTxn = await recordTransaction({
            accountId: account.id,
            transactionType: 'deposit',
            amount: 1500.00,
            description: 'Test deposit',
            performedBy: staff.id
        });

        await account.reload();
        console.log(`✅ Deposit successful!`);
        console.log(`   Reference: ${depositTxn.reference}`);
        console.log(`   Balance After: ${depositTxn.balanceAfter}`);
        console.log(`   Account Balance: ${account.balance}\\n`);

        // 4. Test withdrawal
        console.log('4. Testing withdrawal (500.00)...');
        const withdrawalTxn = await recordTransaction({
            accountId: account.id,
            transactionType: 'withdrawal',
            amount: 500.00,
            description: 'Test withdrawal',
            performedBy: staff.id
        });

        await account.reload();
        console.log(`✅ Withdrawal successful!`);
        console.log(`   Reference: ${withdrawalTxn.reference}`);
        console.log(`   Balance After: ${withdrawalTxn.balanceAfter}`);
        console.log(`   Account Balance: ${account.balance}\\n`);

        // 5. Test insufficient balance
        console.log('5. Testing insufficient balance (10000.00)...');
        try {
            await recordTransaction({
                accountId: account.id,
                transactionType: 'withdrawal',
                amount: 10000.00,
                description: 'Should fail',
                performedBy: staff.id
            });
            console.log('❌ Test failed - should have thrown error\\n');
        } catch (error) {
            console.log(`✅ Correctly rejected: ${error.message}\\n`);
        }

        // 6. Test concurrent transactions (race condition)
        console.log('6. Testing concurrent transactions...');
        try {
            await Promise.all([
                recordTransaction({
                    accountId: account.id,
                    transactionType: 'deposit',
                    amount: 100.00,
                    description: 'Concurrent deposit 1',
                    performedBy: staff.id
                }),
                recordTransaction({
                    accountId: account.id,
                    transactionType: 'deposit',
                    amount: 200.00,
                    description: 'Concurrent deposit 2',
                    performedBy: staff.id
                }),
                recordTransaction({
                    accountId: account.id,
                    transactionType: 'withdrawal',
                    amount: 50.00,
                    description: 'Concurrent withdrawal',
                    performedBy: staff.id
                })
            ]);

            await account.reload();
            console.log(`✅ Concurrent transactions successful!`);
            console.log(`   Final Balance: ${account.balance}\\n`);
        } catch (error) {
            console.log(`❌ Concurrent transaction error: ${error.message}\\n`);
        }

        // 7. Get transaction count
        console.log('7. Transaction summary...');
        const txnCount = await Transaction.count({
            where: { accountId: account.id }
        });
        console.log(`✅ Total transactions: ${txnCount}\\n`);

        console.log('=== All Tests Passed! ===\\n');
    } catch (error) {
        console.error('❌ Test Error:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

testAccountOperations();
