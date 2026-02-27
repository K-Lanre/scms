const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PostingLog = sequelize.define('PostingLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.ENUM('interest', 'dividend'),
            allowNull: false
        },
        period: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'E.g., FY-2024, or Monthly-2024-02'
        },
        rate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        totalAmount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0
        },
        beneficiaryCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed'),
            allowNull: false,
            defaultValue: 'pending'
        },
        performedBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'PostingLogs',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['type', 'period'] // Prevent duplicate postings for the same period
            },
            {
                fields: ['status']
            }
        ]
    });

    PostingLog.associate = (models) => {
        PostingLog.belongsTo(models.User, {
            foreignKey: 'performedBy',
            as: 'performer'
        });
    };

    return PostingLog;
};
