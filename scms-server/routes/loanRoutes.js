const express = require('express');
const loanController = require('../controllers/loanController');
const repaymentController = require('../controllers/repaymentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loan management and workflows
 */

router.post('/apply', restrictTo('member'), loanController.applyForLoan);
router.get('/', loanController.getAllLoans);

router.patch('/:id/review', restrictTo('staff', 'super_admin'), loanController.reviewLoan);
router.patch('/:id/disburse', restrictTo('staff', 'super_admin'), loanController.disburseLoan);

// Repayment routes
router.post('/:id/repay', repaymentController.makeManualRepayment);
router.get('/:id/repayments', repaymentController.getRepaymentHistory);

module.exports = router;
