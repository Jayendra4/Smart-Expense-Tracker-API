const express = require('express');
const expenseController = require('../controllers/expenseController');
const { createExpenseRules } = require('../validators/expenseValidator');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Endpoints for managing expenses
 */

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create new expense
 *     description: Create a new expense record in the system.
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExpenseRequest'
 *     responses:
 *       201:
 *         description: Expense successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         expense:
 *                           $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', createExpenseRules, validateRequest, expenseController.createExpense);

/**
 * @swagger
 * /api/expenses/summary:
 *   get:
 *     summary: Return total expense and category-wise breakdown
 *     description: Retrieves the overall total and category-wise totals.
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: Summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ExpenseSummary'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/summary', expenseController.getExpenseSummary);

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses
 *     description: Retrieves a list of expenses with optional filtering by category.
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter expenses by exact category string (case-insensitive)
 *     responses:
 *       200:
 *         description: Data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         expenses:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Expense'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', expenseController.getExpenses);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete expense
 *     description: Permanently deletes an expense from the storage by its unique ID.
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the expense to delete
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
