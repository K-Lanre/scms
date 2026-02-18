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

router.get('/', restrictTo('super_admin', 'staff'), userController.getAllUsers);

module.exports = router;
