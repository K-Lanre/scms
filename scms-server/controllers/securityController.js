const { User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * /api/v1/security/set-pin:
 *   post:
 *     summary: Set a new 4-digit transaction PIN
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pin
 *             properties:
 *               pin:
 *                 type: string
 *                 description: A 4-digit PIN
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: PIN set successfully
 */
exports.setPin = catchAsync(async (req, res, next) => {
    const { pin } = req.body;
    const user = await User.findByPk(req.user.id);

    // Validate PIN format (exactly 4 digits)
    if (!pin || !/^\d{4}$/.test(pin)) {
        return next(new AppError('PIN must be exactly 4 digits.', 400));
    }

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    user.transactionPin = pin;
    await user.save({ validate: false }); // User hooks will hash it automatically

    res.status(200).json({
        status: 'success',
        message: 'Transaction PIN set successfully.'
    });
});

/**
 * @swagger
 * /api/v1/security/verify-pin:
 *   post:
 *     summary: Verify exactly the 4-digit transaction PIN before sensitive actions
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pin
 *             properties:
 *               pin:
 *                 type: string
 *                 description: The user's 4-digit PIN
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: PIN is valid
 *       400:
 *         description: Invalid PIN
 *       403:
 *         description: PIN not set
 */
exports.verifyPin = catchAsync(async (req, res, next) => {
    const { pin } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    if (!user.transactionPin) {
        return next(new AppError('Transaction PIN is not set. Please set up your PIN first.', 403));
    }

    if (!pin) {
        return next(new AppError('Please provide your transaction PIN.', 400));
    }

    const isMatch = await user.validatePin(pin);

    if (!isMatch) {
        return next(new AppError('Incorrect transaction PIN.', 400));
    }

    res.status(200).json({
        status: 'success',
        message: 'PIN verified successfully.'
    });
});

/**
 * @swagger
 * /api/v1/security/change-pin:
 *   post:
 *     summary: Change the user's transaction PIN
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPin
 *               - newPin
 *             properties:
 *               oldPin:
 *                 type: string
 *                 description: The user's current 4-digit PIN
 *               newPin:
 *                 type: string
 *                 description: The user's new 4-digit PIN
 *     responses:
 *       200:
 *         description: PIN changed successfully
 *       400:
 *         description: Invalid old or new PIN
 *       403:
 *         description: PIN not set
 */
exports.changePin = catchAsync(async (req, res, next) => {
    const { oldPin, newPin } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    if (!user.transactionPin) {
        return next(new AppError('Transaction PIN is not set. Please set up your PIN first.', 403));
    }

    if (!oldPin || !newPin) {
        return next(new AppError('Please provide both old and new PINs.', 400));
    }

    if (!/^\d{4}$/.test(newPin)) {
        return next(new AppError('New PIN must be exactly 4 digits.', 400));
    }

    const isMatch = await user.validatePin(oldPin);

    if (!isMatch) {
        return next(new AppError('Incorrect old transaction PIN.', 400));
    }

    user.transactionPin = newPin;
    await user.save({ validate: false });

    res.status(200).json({
        status: 'success',
        message: 'Transaction PIN changed successfully.'
    });
});
