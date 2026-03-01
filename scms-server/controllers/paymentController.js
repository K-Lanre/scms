const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Account } = require('../models');
const { recordTransaction } = require('../utils/transactionHelper');
const PaystackService = require('../services/paystackService');
const fetch = global.fetch;

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const getHeaders = () => ({
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
});

/**
 * Initialize a Paystack payment for account funding
 * POST /api/v1/payments/initialize
 */
exports.initializePayment = catchAsync(async (req, res, next) => {
    const { accountId, amount } = req.body;

    if (!accountId || !amount) {
        return next(new AppError('Account ID and amount are required', 400));
    }

    if (amount < 100) {
        return next(new AppError('Minimum deposit amount is ₦100', 400));
    }

    // Verify account belongs to user
    const account = await Account.findOne({
        where: { id: accountId, userId: req.user.id, status: 'active' }
    });

    if (!account) {
        return next(new AppError('Account not found or not active', 404));
    }

    const reference = `DEP_${req.user.id}_${Date.now()}`;
    const amountInKobo = Math.round(amount * 100);

    // Mock mode if no Paystack key
    if (!PAYSTACK_SECRET_KEY || !PAYSTACK_SECRET_KEY.startsWith('sk_')) {
        console.warn('[Paystack] Using mock payment initialization');
        return res.status(200).json({
            status: 'success',
            data: {
                authorization_url: `${req.get('origin') || 'http://localhost:5173'}/accounts/fund/verify?reference=${reference}&mock=true&accountId=${accountId}&amount=${amount}`,
                reference,
                access_code: 'mock_access',
                isMock: true
            }
        });
    }

    const callbackUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accounts/fund/verify`;

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            email: req.user.email,
            amount: amountInKobo,
            reference,
            callback_url: callbackUrl,
            metadata: {
                accountId,
                userId: req.user.id,
                custom_fields: [
                    { display_name: 'Account', variable_name: 'account_id', value: accountId }
                ]
            }
        })
    });

    const result = await response.json();

    if (!result.status) {
        return next(new AppError(`Payment initialization failed: ${result.message}`, 400));
    }

    res.status(200).json({
        status: 'success',
        data: {
            authorization_url: result.data.authorization_url,
            reference: result.data.reference,
            access_code: result.data.access_code
        }
    });
});

/**
 * Verify a Paystack payment and credit the account
 * GET /api/v1/payments/verify/:reference
 */
exports.verifyPayment = catchAsync(async (req, res, next) => {
    const { reference } = req.params;
    const { mock, accountId, amount } = req.query;

    if (!reference) {
        return next(new AppError('Payment reference is required', 400));
    }

    let paymentData;

    // Handle mock payments in development
    if (mock === 'true') {
        paymentData = {
            amount: parseFloat(amount) * 100,
            metadata: { accountId: parseInt(accountId) },
            reference,
            status: 'success'
        };
    } else {
        if (!PAYSTACK_SECRET_KEY || !PAYSTACK_SECRET_KEY.startsWith('sk_')) {
            return next(new AppError('Paystack not configured. Use mock mode.', 400));
        }

        const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
            method: 'GET',
            headers: getHeaders()
        });

        const result = await response.json();

        if (!result.status || result.data.status !== 'success') {
            return next(new AppError('Payment verification failed or payment was not successful', 400));
        }

        paymentData = result.data;
    }

    // Extract accountId from metadata or query
    const targetAccountId = paymentData.metadata?.accountId || parseInt(accountId);
    const depositAmount = paymentData.amount / 100; // Convert from kobo

    if (!targetAccountId) {
        return next(new AppError('Could not determine target account from payment data', 400));
    }

    // Verify account belongs to user
    const account = await Account.findOne({
        where: { id: targetAccountId, userId: req.user.id }
    });

    if (!account) {
        return next(new AppError('Target account not found', 404));
    }

    // Record the deposit transaction
    const transaction = await recordTransaction({
        accountId: targetAccountId,
        transactionType: 'deposit',
        amount: depositAmount,
        description: `Online deposit via Paystack (Ref: ${reference})`,
        performedBy: req.user.id
    });

    res.status(200).json({
        status: 'success',
        message: `Successfully credited ₦${depositAmount.toLocaleString()} to your account.`,
        data: {
            transaction,
            amount: depositAmount,
            reference,
            newBalance: account.balance
        }
    });
});
