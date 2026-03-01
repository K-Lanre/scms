const express = require('express');
const securityController = require('../controllers/securityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Security
 *   description: User security and authorization operations
 */

router.use(protect); // All security routes require authentication

router.post('/set-pin', securityController.setPin);
router.post('/verify-pin', securityController.verifyPin);
router.post('/change-pin', securityController.changePin);

module.exports = router;
