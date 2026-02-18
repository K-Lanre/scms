const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const paystackWebhookController = require('./controllers/paystackWebhookController'); // Added this line
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/savings', require('./routes/savingsRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

// Webhooks
app.post('/api/v1/webhooks/paystack', paystackWebhookController.handlePaystackWebhook); // Added this line

// Handle Unhandled Routes
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
