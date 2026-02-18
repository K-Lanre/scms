const express = require('express');
const savingsProductController = require('../controllers/savingsProductController');
const savingsPlanController = require('../controllers/savingsPlanController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public/Member routes
router.get('/products', savingsProductController.getAllProducts);

// Plans (Member)
router.use(protect);
router.post('/plans', restrictTo('member'), savingsPlanController.createPlan);
router.get('/my-plans', restrictTo('member'), savingsPlanController.getMyPlans);
router.post('/plans/:id/withdraw', restrictTo('member'), savingsPlanController.withdrawFromPlan);

// Admin only routes
router.use(restrictTo('super_admin', 'staff'));

router.post('/products', savingsProductController.createProduct);
router.patch('/products/:id', savingsProductController.updateProduct);

module.exports = router;
