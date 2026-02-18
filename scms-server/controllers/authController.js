const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    user.password = undefined; // Hide password in response

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
        return next(new AppError('Please provide name, email, password and passwordConfirm!', 400));
    }

    if (password !== passwordConfirm) {
        return next(new AppError('Passwords do not match!', 400));
    }

    const newUser = await User.create({
        name,
        email,
        password,
        role: 'user', // Force default role
        status: 'active'
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save(); // Don't use validate: false because we want hooks to run if needed, though here we only changed reset fields

    // 3) Send it to user's email
    try {
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const { Op } = require('sequelize');
    const user = await User.findOne({
        where: {
            passwordResetToken: hashedToken,
            passwordResetExpires: { [Op.gt]: Date.now() }
        }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Log the user in, send JWT
    createSendToken(user, 200, res);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findByPk(req.user.id);

    // 2) Check if POSTed current password is correct
    if (!(await user.validatePassword(req.body.passwordCurrent))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
});

exports.profile = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
