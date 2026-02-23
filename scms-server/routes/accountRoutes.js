const express = require('express');
const accountController = require('../controllers/accountController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Account management endpoints
 */

// Create account (staff/admin only)
router.post('/', restrictTo('super_admin'), accountController.createAccount);

// Get my accounts (all authenticated users)
router.get('/my-accounts', accountController.getMyAccounts);

// Get account by ID
router.get('/:id', accountController.getAccountById);

// Get account statement
router.get('/:id/statement', accountController.getAccountStatement);

// Get user financials (staff/admin only)
router.get('/user/:userId', restrictTo('super_admin', 'staff'), accountController.getUserFinancials);

module.exports = router;
