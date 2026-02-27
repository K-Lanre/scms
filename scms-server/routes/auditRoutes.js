const express = require('express');
const { AuditLog, User } = require('../models');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// Only super_admin can view audit logs
router.use(protect);
router.use(restrictTo('super_admin'));

/**
 * Get paginated audit logs
 */
router.get('/', catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const { count, rows } = await AuditLog.findAndCountAll({
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit,
        offset
    });

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: {
            logs: rows,
            pagination: {
                total: count,
                page,
                limit,
                pages: Math.ceil(count / limit)
            }
        }
    });
}));

module.exports = router;
