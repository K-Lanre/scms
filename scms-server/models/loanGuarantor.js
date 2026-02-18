const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const LoanGuarantor = sequelize.define('LoanGuarantor', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        loanId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Loans',
                key: 'id'
            }
        },
        guarantorUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
            defaultValue: 'pending'
        }
    }, {
        tableName: 'LoanGuarantors',
        timestamps: true
    });

    LoanGuarantor.associate = (models) => {
        LoanGuarantor.belongsTo(models.Loan, { foreignKey: 'loanId', as: 'loan' });
        LoanGuarantor.belongsTo(models.User, { foreignKey: 'guarantorUserId', as: 'guarantor' });
    };

    return LoanGuarantor;
};
