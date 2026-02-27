const { SavingsProduct } = require('./models');

async function seed() {
    try {
        const products = [
            {
                name: 'Rent Savings',
                description: 'Save easily for your next house rent with automated daily or weekly deductions.',
                type: 'target',
                category: 'rent',
                isQuickSaving: true,
                interestRate: 15.00,
                minDuration: 180,
                minDeposit: 5000.00,
                penaltyPercentage: 1.00,
                allowEarlyWithdrawal: true
            },
            {
                name: 'Back to School',
                description: 'Keep your children in school by saving for fees and supplies throughout the term.',
                type: 'target',
                category: 'education',
                isQuickSaving: true,
                interestRate: 15.00,
                minDuration: 90,
                minDeposit: 2000.00,
                penaltyPercentage: 1.00,
                allowEarlyWithdrawal: true
            },
            {
                name: 'SafeBox',
                description: 'A digital piggy bank for your spare change. Hide money away for a rainy day.',
                type: 'safebox',
                category: 'none',
                isQuickSaving: false,
                interestRate: 15.00,
                minDuration: 30,
                minDeposit: 1000.00,
                penaltyPercentage: 0.00, // SafeBox penalty removed in favor of 24h delay
                allowEarlyWithdrawal: true
            },
            {
                name: 'Target Savings',
                description: 'Set a goal and save towards it. Flexible duration and amount.',
                type: 'target',
                category: 'none',
                isQuickSaving: false,
                interestRate: 10.00,
                minDuration: 30,
                minDeposit: 1000.00,
                penaltyPercentage: 1.00,
                allowEarlyWithdrawal: true
            },
            {
                name: 'High-Yield Fixed',
                description: 'Lock your funds for maximum growth. Up to 18% annual interest for long-term locks.',
                type: 'fixed',
                category: 'none',
                isQuickSaving: false,
                interestRate: 18.00,
                minDuration: 365,
                minDeposit: 50000.00,
                penaltyPercentage: 0.00,
                allowEarlyWithdrawal: false
            }
        ];

        for (const p of products) {
            const [product, created] = await SavingsProduct.findOrCreate({
                where: { name: p.name },
                defaults: p
            });
            if (created) {
                console.log(`Created product: ${p.name}`);
            } else {
                await product.update(p);
                console.log(`Updated product: ${p.name}`);
            }
        }
        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
