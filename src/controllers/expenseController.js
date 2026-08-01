const expenseService = require('../services/expenseService');
const { sendSuccess } = require('../utils/responseHelper');

const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.body);
    return sendSuccess(res, 201, 'Expense successfully created', { expense });
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const { category } = req.query;
    
    const expenses = category 
      ? await expenseService.getExpensesByCategory(category)
      : await expenseService.getAllExpenses();
      
    return sendSuccess(res, 200, 'Expenses retrieved successfully', { expenses });
  } catch (error) {
    next(error);
  }
};

const getExpenseSummary = async (req, res, next) => {
  try {
    const summary = await expenseService.getExpenseSummary();
    return sendSuccess(res, 200, 'Expense summary retrieved successfully', summary);
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    await expenseService.deleteExpense(id);
    return sendSuccess(res, 200, 'Expense deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseSummary,
  deleteExpense
};
