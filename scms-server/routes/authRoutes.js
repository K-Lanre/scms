const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and User management
 */

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// PROTECTED ROUTES (Requires Login)
router.use(authMiddleware.protect);

router.patch('/updateMyPassword', authController.updateMyPassword);
router.get('/profile', authController.profile);
router.patch('/update-profile', userController.updateProfile);

// ADMIN ONLY ROUTES (Requires Login + Admin/Staff role)
router.use(authMiddleware.restrictTo('super_admin', 'staff'));

router.patch('/:id/approve', userController.approveMember);
router.get('/', userController.getAllUsers);

module.exports = router;
