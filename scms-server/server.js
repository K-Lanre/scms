const app = require('./app');
const fs = require('fs');
const path = require('path');
const logger = require('./config/logger');
const { validateSourceFiles } = require('./utils/fileIntegrity');
const { monitorFileSizes } = require('./utils/fileMonitor');

console.log(app.get('env'));

// File size validation to prevent corruption
const validateServerFile = () => {
    const serverPath = __filename;
    const stats = fs.statSync(serverPath);
    if (stats.size > 1000000) { // 1 MB threshold
        logger.error('CRITICAL: server.js file is too large!');
        logger.error(`Size: ${stats.size} bytes`);
        logger.error('Possible file corruption detected. Please restore from backup.');
        process.exit(1);
    }
};
validateServerFile();

// Validate all source files on startup
validateSourceFiles();

// Start file size monitoring
monitorFileSizes();

const { connectDB } = require('./config/database');
const { startScheduler } = require('./jobs/scheduler');

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

process.on('uncaughtException', err => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', { error: err.message, stack: err.stack });
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', err => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...', { error: err.message, stack: err.stack });
    gracefulShutdown('unhandledRejection');
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Connect to Database
connectDB().then(() => {
    console.log('Database connected successfully (server.js)');

    // Start cron jobs after DB connection
    startScheduler();
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    logger.info(`App running on port ${PORT}...`);
});
