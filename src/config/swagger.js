const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Expense Tracker API',
      version: '1.0.0',
      description: 'A production-ready REST API for managing personal expenses.',
      contact: {
        name: 'Jayendra',
        email: 'jayendrabamne68@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'API Server',
      },
    ],
    tags: [
      {
        name: 'Expenses',
        description: 'Endpoints for managing expenses'
      },
      {
        name: 'System',
        description: 'System health and utility endpoints'
      }
    ],
    components: {
      schemas: {
        Expense: {
          type: 'object',
          required: ['id', 'title', 'amount', 'category', 'date'],
          properties: {
            id: { type: 'string', format: 'uuid', example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' },
            title: { type: 'string', example: 'Groceries' },
            amount: { type: 'number', example: 45.5 },
            category: { type: 'string', example: 'Food' },
            date: { type: 'string', format: 'date-time', example: '2026-08-01T12:00:00.000Z' }
          }
        },
        CreateExpenseRequest: {
          type: 'object',
          required: ['title', 'amount', 'category', 'date'],
          properties: {
            title: { type: 'string', example: 'Groceries' },
            amount: { type: 'number', example: 45.5 },
            category: { type: 'string', example: 'Food' },
            date: { type: 'string', format: 'date-time', example: '2026-08-01T12:00:00.000Z' }
          }
        },
        ExpenseSummary: {
          type: 'object',
          required: ['total', 'categories'],
          properties: {
            total: { type: 'number', example: 120.5 },
            categories: {
              type: 'object',
              additionalProperties: { type: 'number' },
              example: {
                "Food": 45.5,
                "Transport": 75.0
              }
            }
          }
        },
        ValidationError: {
          type: 'object',
          required: ['field', 'message'],
          properties: {
            field: { type: 'string', example: 'amount' },
            message: { type: 'string', example: 'Amount must be a positive number' }
          }
        },
        ErrorResponse: {
          type: 'object',
          required: ['success', 'message'],
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Something went wrong' },
            errors: {
              type: 'array',
              items: { $ref: '#/components/schemas/ValidationError' },
              example: []
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          required: ['success', 'message'],
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object', example: {} }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'The requested resource was not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                success: false,
                message: 'Resource not found',
                errors: []
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                success: false,
                message: 'Internal Server Error',
                errors: []
              }
            }
          }
        },

      }
    }
  },
  apis: ['./src/routes/*.js', './src/app.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
