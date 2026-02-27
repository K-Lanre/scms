const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AuditLog = sequelize.define('AuditLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Nullable for failed logins from unknown users
            references: {
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'E.g., LOGIN_SUCCESS, LOAN_APPROVAL'
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON or text metadata about the action'
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'AuditLogs',
        timestamps: true,
        updatedAt: false, // We only care when it was created
        indexes: [
            {
                fields: ['userId']
            },
            {
                fields: ['action']
            },
            {
                fields: ['createdAt']
            }
        ]
    });

    AuditLog.associate = (models) => {
        AuditLog.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return AuditLog;
};
