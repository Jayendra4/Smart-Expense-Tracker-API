const request = require('supertest');
const fs = require('fs').promises;
const path = require('path');
const app = require('../src/app');

const DATA_FILE = path.join(__dirname, '../src/data/expenses.json');

const resetDataFile = async (data = []) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

const mockCorruptedData = async () => {
  await fs.writeFile(DATA_FILE, '{invalid_json_format_without_quotes}');
};

beforeEach(async () => {
  await resetDataFile();
});

afterAll(async () => {
  await resetDataFile(); 
});

describe('Smart Expense Tracker API Integration Tests', () => {
  
  describe('GET /health', () => {
    it('returns 200 and server status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Server is running');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('environment');
    });
  });

  describe('POST /api/expenses', () => {
    it('Successfully create a valid expense (201)', async () => {
      const newExpense = {
        title: 'Lunch',
        amount: 15.5,
        category: 'Food',
        date: '2026-08-01T12:00:00.000Z'
      };
      const res = await request(app).post('/api/expenses').send(newExpense);
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.expense).toHaveProperty('id');
      expect(res.body.data.expense.title).toBe(newExpense.title);
      expect(res.body.data.expense.amount).toBe(newExpense.amount);
    });

    it('Reject missing title (400)', async () => {
      const res = await request(app).post('/api/expenses').send({ amount: 10, category: 'Food', date: '2026-08-01T12:00:00.000Z' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some(e => e.field === 'title')).toBe(true);
    });

    it('Reject missing amount (400)', async () => {
      const res = await request(app).post('/api/expenses').send({ title: 'Lunch', category: 'Food', date: '2026-08-01T12:00:00.000Z' });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field === 'amount')).toBe(true);
    });

    it('Reject missing category (400)', async () => {
      const res = await request(app).post('/api/expenses').send({ title: 'Lunch', amount: 10, date: '2026-08-01T12:00:00.000Z' });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field === 'category')).toBe(true);
    });

    it('Reject missing date (400)', async () => {
      const res = await request(app).post('/api/expenses').send({ title: 'Lunch', amount: 10, category: 'Food' });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field === 'date')).toBe(true);
    });

    it('Reject negative amount (400)', async () => {
      const res = await request(app).post('/api/expenses').send({ title: 'Lunch', amount: -5, category: 'Food', date: '2026-08-01T12:00:00.000Z' });
      expect(res.status).toBe(400);
      expect(res.body.errors.some(e => e.field === 'amount')).toBe(true);
    });
  });

  describe('GET /api/expenses', () => {
    beforeEach(async () => {
      await resetDataFile([
        { id: '1', title: 'Lunch', amount: 10, category: 'Food', date: '2026-08-01T12:00:00.000Z' },
        { id: '2', title: 'Bus', amount: 5, category: 'Transport', date: '2026-08-01T12:00:00.000Z' },
        { id: '3', title: 'Dinner', amount: 20, category: 'FOOD', date: '2026-08-01T12:00:00.000Z' }
      ]);
    });

    it('Get all expenses', async () => {
      const res = await request(app).get('/api/expenses');
      expect(res.status).toBe(200);
      expect(res.body.data.expenses.length).toBe(3);
    });

    it('Filter expenses by category', async () => {
      const res = await request(app).get('/api/expenses?category=Transport');
      expect(res.status).toBe(200);
      expect(res.body.data.expenses.length).toBe(1);
      expect(res.body.data.expenses[0].category).toBe('Transport');
    });

    it('Filter category should be case-insensitive', async () => {
      const res = await request(app).get('/api/expenses?category=food');
      expect(res.status).toBe(200);
      expect(res.body.data.expenses.length).toBe(2);
    });

    it('Unknown category returns empty array', async () => {
      const res = await request(app).get('/api/expenses?category=Unknown');
      expect(res.status).toBe(200);
      expect(res.body.data.expenses.length).toBe(0);
    });
  });

  describe('GET /api/expenses/summary', () => {
    it('Empty summary returns zero totals', async () => {
      const res = await request(app).get('/api/expenses/summary');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(0);
      expect(Object.keys(res.body.data.categories).length).toBe(0);
    });

    it('Summary after multiple expenses & Category totals are calculated correctly', async () => {
      await resetDataFile([
        { id: '1', title: 'Lunch', amount: 10.5, category: 'Food', date: '2026-08-01T12:00:00.000Z' },
        { id: '2', title: 'Dinner', amount: 20.25, category: 'Food', date: '2026-08-01T12:00:00.000Z' },
        { id: '3', title: 'Bus', amount: 5, category: 'Transport', date: '2026-08-01T12:00:00.000Z' }
      ]);
      const res = await request(app).get('/api/expenses/summary');
      expect(res.status).toBe(200);
      // Tests our 2 decimal place rounding logic
      expect(res.body.data.total).toBe(35.75); 
      expect(res.body.data.categories['Food']).toBe(30.75);
      expect(res.body.data.categories['Transport']).toBe(5);
    });
  });

  describe('DELETE /api/expenses/:id', () => {
    beforeEach(async () => {
      await resetDataFile([
        { id: 'valid-id', title: 'Lunch', amount: 10, category: 'Food', date: '2026-08-01T12:00:00.000Z' }
      ]);
    });

    it('Delete existing expense', async () => {
      const res = await request(app).delete('/api/expenses/valid-id');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Expense deleted successfully');
      
      const fileData = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
      expect(fileData.length).toBe(0);
    });

    it('Delete unknown expense returns 404', async () => {
      const res = await request(app).delete('/api/expenses/unknown-id');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe('Corrupted JSON', () => {
    it('Mock corrupted JSON and Verify API returns HTTP 500 without resetting data', async () => {
      await mockCorruptedData();
      
      const res = await request(app).get('/api/expenses');
      
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Data storage is corrupted. Manual intervention required.');
      
      // Verify data was NOT reset to '[]'
      const content = await fs.readFile(DATA_FILE, 'utf8');
      expect(content).toBe('{invalid_json_format_without_quotes}');
    });
  });
});
