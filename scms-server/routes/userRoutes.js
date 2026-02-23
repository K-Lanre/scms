const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// protect all routes after this middleware
router.use(protect);

// Allow users to update their own profile
router.patch('/update-profile', userController.updateProfile);

// Allow Admin to approve users
router.patch('/:id/approve', restrictTo('super_admin', 'staff'), userController.approveMember);

// Allow Admin to reject users
router.patch('/:id/reject', restrictTo('super_admin', 'staff'), userController.rejectMember);

// Allow Admin to update user role/status
router.patch('/:id/admin-update', restrictTo('super_admin', 'staff'), userController.adminUpdateUser);

// Allow Admin to create user directly
router.post('/admin-create', restrictTo('super_admin'), userController.adminCreateUser);

router.get('/', restrictTo('super_admin', 'staff'), userController.getAllUsers);

module.exports = router;
