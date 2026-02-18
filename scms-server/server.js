const app = require('./app');

console.log(app.get('env'));
const { connectDB } = require('./config/database');
const { startScheduler } = require('./jobs/scheduler');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// Connect to Database
connectDB().then(() => {
    console.log('Database connected successfully (server.js)');

    // Start cron jobs after DB connection
    startScheduler();
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
