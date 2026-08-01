const fs = require('fs').promises;
const path = require('path');
const AppError = require('./AppError');

const DATA_FILE = path.join(__dirname, '../data/expenses.json');

const readExpenses = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, '[]');
      return [];
    }
    if (error instanceof SyntaxError) {
      // Preserve corrupted JSON for manual recovery.
      throw new AppError('Data storage is corrupted. Manual intervention required.', 500);
    }
    throw error;
  }
};

const writeExpenses = async (expenses) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2));
};

module.exports = {
  readExpenses,
  writeExpenses
};
