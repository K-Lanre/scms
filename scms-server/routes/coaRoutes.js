const express = require('express');
const coaController = require('../controllers/coaController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chart of Accounts
 *   description: General Ledger and aggregated financial data
 */

router.use(protect);
router.use(restrictTo('admin', 'super_admin', 'staff'));

/**
 * @swagger
 * /api/v1/coa:
 *   get:
 *     summary: Get generated Chart of Accounts
 *     tags: [Chart of Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chart of Accounts retrieved successfully
 */
router.get('/', coaController.getChartOfAccounts);

module.exports = router;
