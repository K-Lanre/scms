const express = require('express');
const transactionController = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction endpoints (deposits, withdrawals)
 */

// Deposit and withdrawal (staff/admin only)
router.post('/deposit', restrictTo('staff', 'super_admin'), transactionController.deposit);
router.post('/withdraw', restrictTo('staff', 'super_admin'), transactionController.withdraw);

// Transfer and Account Lookup (available to all authenticated users)
router.post('/transfer', transactionController.transfer);
router.get('/find-account/:accountNumber', transactionController.findAccountByNumber);

// Get transaction history (available to all authenticated users)
router.get('/', transactionController.getAllTransactions);

module.exports = router;
