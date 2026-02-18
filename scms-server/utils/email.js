const nodemailer = require('nodemailer');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = process.env.EMAIL_FROM;
    }

    newTransport() {
        // Mailtrap for development
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // Send the actual email
    async send(subject, text) {
        // 1) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text
            // html: can be added later if needed
        };

        // 2) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendPasswordReset() {
        await this.send(
            'Your password reset token (valid for only 10 minutes)',
            `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${this.url}.\nIf you didn't forget your password, please ignore this email!`
        );
    }

    async sendFailedDeductionNotice(loan, failedCount) {
        const subject = '⚠️ Loan Payment Deduction Failed - Action Required';
        const text = `Dear ${this.firstName},\n\nWe attempted to deduct your monthly loan payment of ₦${loan.monthlyDeductionAmount} for Loan #${loan.id}, but your savings account has insufficient funds.\n\nLoan Details:\n- Outstanding Balance: ₦${loan.outstandingBalance}\n- Monthly Payment: ₦${loan.monthlyDeductionAmount}\n- Failed Attempts: ${failedCount}/3\n\n⚠️ IMPORTANT: After 3 consecutive failed deductions, your loan will be marked as DEFAULTED and a 2-month extension with additional interest will be automatically applied.\n\nPlease ensure your savings account has sufficient funds before the next deduction attempt.\n\nBest regards,\nSCMS Team`;

        await this.send(subject, text);
    }

    async sendLoanDefaultNotice(loan, extensionInterest, newDueDate) {
        const subject = '🚨 Loan Default - Extension Applied';
        const text = `Dear ${this.firstName},\n\nYour loan (Loan #${loan.id}) has been marked as DEFAULTED due to ${loan.repaymentMode === 'automated' ? 'consecutive failed payment deductions' : 'non-payment by the due date'}.\n\nOriginal Loan Details:\n- Loan Amount: ₦${loan.loanAmount}\n- Outstanding Balance: ₦${loan.outstandingBalance}\n- Original Due Date: ${loan.originalDueDate}\n\nExtension Details:\n- Extension Period: 2 months\n- Additional Interest: ₦${extensionInterest}\n- New Outstanding Balance: ₦${parseFloat(loan.outstandingBalance) + parseFloat(extensionInterest)}\n- New Due Date: ${newDueDate}\n\nPlease make arrangements to clear your outstanding balance to avoid further penalties.\n\nBest regards,\nSCMS Team`;

        await this.send(subject, text);
    }

    async sendSavingsMaturityNotice(plan, finalBalance) {
        const subject = '🎉 Savings Plan Matured - Funds Transferred';
        const text = `Dear ${this.firstName},\\n\\nCongratulations! Your savings plan (Plan #${plan.id}) has reached maturity.\\n\\nMaturity Details:\\n- Start Date: ${plan.startDate.toISOString().split('T')[0]}\\n- Maturity Date: ${plan.maturityDate.toISOString().split('T')[0]}\\n- Final Balance: ₦${finalBalance}\\n\\nThe full balance has been automatically transferred to your main savings account. You can now access these funds for withdrawals or use them for other transactions.\\n\\nThank you for saving with us!\\n\\nBest regards,\\nSCMS Team`;

        await this.send(subject, text);
    }

    async sendFailedAutoSaveNotice(plan, requiredAmount, availableBalance) {
        const subject = 'ℹ️ Automatic Savings Deposit Skipped';
        const text = `Dear ${this.firstName},\\n\\nWe attempted to process your automatic monthly deposit to Savings Plan #${plan.id}, but your main savings account has insufficient funds.\\n\\nDeposit Details:\\n- Required Amount: ₦${requiredAmount}\\n- Available Balance: ₦${availableBalance}\\n- Shortage: ₦${(requiredAmount - availableBalance).toFixed(2)}\\n\\nℹ️ This month's automatic deposit has been skipped. No penalties apply - we'll try again next month.\\n\\nTo ensure successful deposits, please maintain sufficient balance in your main savings account.\\n\\nBest regards,\\nSCMS Team`;

        await this.send(subject, text);
    }
};
