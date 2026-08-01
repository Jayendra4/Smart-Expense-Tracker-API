const crypto = require('crypto');
const fileUtils = require('../utils/fileUtils');
const AppError = require('../utils/AppError');

// Assumes payload is pre-validated by the router.
const createExpense = async (expenseData) => {
  const expenses = await fileUtils.readExpenses();
  
  const newExpense = {
    id: crypto.randomUUID(),
    title: expenseData.title,
    amount: expenseData.amount,
    category: expenseData.category,
    date: expenseData.date
  };
  
  expenses.push(newExpense);
  await fileUtils.writeExpenses(expenses);
  
  return newExpense;
};

const getAllExpenses = async () => {
  return await fileUtils.readExpenses();
};

const getExpensesByCategory = async (category) => {
  const expenses = await fileUtils.readExpenses();
  const lowerCategory = category.trim().toLowerCase();
  
  return expenses.filter(exp => exp.category.trim().toLowerCase() === lowerCategory);
};

const getExpenseSummary = async () => {
  const expenses = await fileUtils.readExpenses();
  
  const summary = {
    total: 0,
    categories: {}
  };
  
  expenses.forEach(exp => {
    summary.total += exp.amount;
    
    // Preserve the exact category string provided by the user
    if (!summary.categories[exp.category]) {
      summary.categories[exp.category] = 0;
    }
    summary.categories[exp.category] += exp.amount;
  });
  
  // Round to 2 decimal places to avoid floating-point issues
  summary.total = Number(summary.total.toFixed(2));
  for (const cat in summary.categories) {
    summary.categories[cat] = Number(summary.categories[cat].toFixed(2));
  }
  
  return summary;
};

const deleteExpense = async (id) => {
  const expenses = await fileUtils.readExpenses();
  const index = expenses.findIndex(exp => exp.id === id);
  
  if (index === -1) {
    throw new AppError(`Expense with ID ${id} not found`, 404);
  }
  
  expenses.splice(index, 1);
  await fileUtils.writeExpenses(expenses);
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpensesByCategory,
  getExpenseSummary,
  deleteExpense
};
