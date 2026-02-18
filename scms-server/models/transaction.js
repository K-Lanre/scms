const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Accounts',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        transactionType: {
            type: DataTypes.ENUM(
                'deposit',
                'withdrawal',
                'loan_disbursement',
                'loan_repayment',
                'interest',
                'dividend',
                'transfer_in',
                'transfer_out'
            ),
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: {
                min: 0.01
            }
        },
        balanceAfter: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Account balance snapshot after this transaction'
        },
        reference: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        performedBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
            comment: 'Staff/admin who performed this transaction'
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'reversed'),
            allowNull: false,
            defaultValue: 'completed'
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'Transactions',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['reference']
            },
            {
                fields: ['accountId']
            },
            {
                fields: ['transactionType']
            },
            {
                fields: ['status']
            },
            {
                fields: ['createdAt']
            },
            {
                fields: ['performedBy']
            }
        ]
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.Account, {
            foreignKey: 'accountId',
            as: 'account'
        });
        Transaction.belongsTo(models.User, {
            foreignKey: 'performedBy',
            as: 'performer'
        });
    };

    return Transaction;
};
