const express = require('express');
const reportController = require('../controllers/reportController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Financial reporting (Balance Sheet, Income Statement)
 */

router.use(protect);
router.use(restrictTo('staff', 'super_admin'));

/**
 * @swagger
 * /api/v1/reports/balance-sheet:
 *   get:
 *     summary: Get generated Balance Sheet (Admin/Staff)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance Sheet retrieved successfully
 */
router.get('/balance-sheet', reportController.getBalanceSheet);

/**
 * @swagger
 * /api/v1/reports/income-statement:
 *   get:
 *     summary: Get generated Income Statement (Admin/Staff)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Income Statement retrieved successfully
 */
router.get('/income-statement', reportController.getIncomeStatement);

module.exports = router;
