const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const expenseRoutes = require('./routes/expenseRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customSiteTitle: 'Smart Expense Tracker API Documentation'
  })
);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Root
 *     description: Returns a welcome message and links to main endpoints.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Welcome response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Welcome to Smart Expense Tracker API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 documentation:
 *                   type: string
 *                   example: /api-docs
 *                 health:
 *                   type: string
 *                   example: /health
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     expenses:
 *                       type: string
 *                       example: /api/expenses
 *                     summary:
 *                       type: string
 *                       example: /api/expenses/summary
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Smart Expense Tracker API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      expenses: '/api/expenses',
      summary: '/api/expenses/summary'
    }
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API Health Check
 *     description: Returns the current status and environment of the server.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is operating normally
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Server is running
 *                 environment:
 *                   type: string
 *                   example: development
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-08-01T12:00:00.000Z
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/expenses', expenseRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

module.exports = app;
