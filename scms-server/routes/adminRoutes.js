const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes protected and restricted to admin/super_admin
router.use(protect);
router.use(restrictTo('admin', 'super_admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard and financial metrics
 */

router.get('/financial-summary', adminController.getFinancialSummary);
router.get('/loan-metrics', adminController.getLoanMetrics);
router.get('/savings-metrics', adminController.getSavingsMetrics);

module.exports = router;
