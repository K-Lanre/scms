const { AuditLog } = require('../models');

/**
 * Log a system action asynchronously without blocking the main event loop
 * @param {Object} req - The Express request object
 * @param {string} action - The action identifier (e.g., 'LOGIN_SUCCESS', 'LOAN_APPROVAL')
 * @param {string|Object} details - Additional context
 * @param {number} userId - The ID of the user performing the action (optional, derived from req.user if available)
 */
const logAction = (req, action, details = null, userId = null) => {
    // Fire and forget
    setImmediate(async () => {
        try {
            const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
            const userAgent = req.headers['user-agent'];

            let finalUserId = userId;
            if (!finalUserId && req.user && req.user.id) {
                finalUserId = req.user.id;
            }

            // Convert details to string if it's an object
            let finalDetails = details;
            if (typeof details === 'object' && details !== null) {
                finalDetails = JSON.stringify(details);
            }

            await AuditLog.create({
                userId: finalUserId,
                action,
                details: finalDetails,
                ipAddress,
                userAgent
            });
        } catch (error) {
            console.error(`[AuditLogger Error] Failed to log action '${action}':`, error);
        }
    });
};

module.exports = {
    logAction
};
