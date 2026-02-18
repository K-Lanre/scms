const { Account, Transaction, User, sequelize } = require('./models');
const { generateAccountNumber, generateReference } = require('./utils/accountHelper');

async function testAccountAndTransaction() {
    try {
        console.log('\\n=== Testing Account and Transaction Models ===\\n');

        // 1. Find or create a test user
        console.log('1. Finding/Creating test user...');
        const [user] = await User.findOrCreate({
            where: { email: 'test@scms.com' },
            defaults: {
                name: 'Test User',
                email: 'test@scms.com',
                password: 'password123',
                role: 'member',
                status: 'active'
            }
        });
        console.log(`✅ User found/created: ${user.name} (ID: ${user.id})\\n`);

        // 2. Create a savings account
        console.log('2. Creating savings account...');
        const accountNumber = await generateAccountNumber();
        const account = await Account.create({
            userId: user.id,
            accountNumber,
            accountType: 'savings',
            balance: 0.00,
            status: 'active',
            openedAt: new Date()
        });
        console.log(`✅ Account created: ${account.accountNumber}\\n`);
        console.log(`   Balance: ${account.balance}`);
        console.log(`   Status: ${account.status}\\n`);

        // 3. Create a deposit transaction using Sequelize transaction
        console.log('3. Creating deposit transaction (1000.00)...');
        const depositAmount = 1000.00;

        const t = await sequelize.transaction();
        try {
            // Create the transaction record
            const transaction = await Transaction.create({
                accountId: account.id,
                transactionType: 'deposit',
                amount: depositAmount,
                balanceAfter: parseFloat(account.balance) + depositAmount,
                reference: generateReference(),
                description: 'Initial deposit',
                performedBy: user.id,
                status: 'completed',
                completedAt: new Date()
            }, { transaction: t });

            // Update account balance
            await account.increment('balance', { by: depositAmount, transaction: t });

            await t.commit();
            console.log(`✅ Deposit successful!\\n`);
            console.log(`   Reference: ${transaction.reference}`);
            console.log(`   Balance After: ${transaction.balanceAfter}\\n`);
        } catch (error) {
            await t.rollback();
            throw error;
        }

        // 4. Reload account to see updated balance
        await account.reload();
        console.log('4. Account balance after deposit:');
        console.log(`   Current Balance: ${account.balance}\\n`);

        // 5. Test canWithdraw method
        console.log('5. Testing withdrawal validation...');
        console.log(`   Can withdraw 500.00? ${account.canWithdraw(500)}`)
            ;
        console.log(`   Can withdraw 1500.00? ${account.canWithdraw(1500)}\\n`);

        // 6. Get transaction history
        console.log('6. Fetching transaction history...');
        const transactions = await Transaction.findAll({
            where: { accountId: account.id },
            include: [
                {
                    model: User,
                    as: 'performer',
                    attributes: ['name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log(`✅ Found ${transactions.length} transaction(s):\\n`);
        transactions.forEach(txn => {
            console.log(`   ${txn.transactionType.toUpperCase()}`);
            console.log(`   Amount: ${txn.amount}`);
            console.log(`   Reference: ${txn.reference}`);
            console.log(`   Performed by: ${txn.performer.name}`);
            console.log(`   Date: ${txn.createdAt}\\n`);
        });

        // 7. Test model associations
        console.log('7. Testing model associations...');
        const userWithAccounts = await User.findByPk(user.id, {
            include: [{
                model: Account,
                as: 'accounts'
            }]
        });
        console.log(`✅ User has ${userWithAccounts.accounts.length} account(s)\\n`);

        console.log('=== All Tests Passed! ===\\n');
    } catch (error) {
        console.error('❌ Test Error:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

testAccountAndTransaction();
