"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _path = _interopRequireDefault(require("path"));

var _typeorm = require("typeorm");

var _database = _interopRequireDefault(require("../database"));

var _Transaction = _interopRequireDefault(require("../models/Transaction"));

var _Category = _interopRequireDefault(require("../models/Category"));

var _app = _interopRequireDefault(require("../app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let connection;
describe('Transaction', () => {
  beforeAll(async () => {
    connection = await (0, _database.default)('test-connection');
    await connection.query('DROP TABLE IF EXISTS transactions');
    await connection.query('DROP TABLE IF EXISTS categories');
    await connection.query('DROP TABLE IF EXISTS migrations');
    await connection.runMigrations();
  });
  beforeEach(async () => {
    await connection.query('DELETE FROM transactions');
    await connection.query('DELETE FROM categories');
  });
  afterAll(async () => {
    const mainConnection = (0, _typeorm.getConnection)();
    await connection.close();
    await mainConnection.close();
  });
  it('should be able to list transactions', async () => {
    await (0, _supertest.default)(_app.default).post('/transactions').send({
      title: 'March Salary',
      type: 'income',
      value: 4000,
      category: 'Salary'
    });
    await (0, _supertest.default)(_app.default).post('/transactions').send({
      title: 'April Salary',
      type: 'income',
      value: 4000,
      category: 'Salary'
    });
    await (0, _supertest.default)(_app.default).post('/transactions').send({
      title: 'Macbook',
      type: 'outcome',
      value: 6000,
      category: 'Eletronics'
    });
    const response = await (0, _supertest.default)(_app.default).get('/transactions');
    expect(response.body.transactions).toHaveLength(3);
    expect(response.body.balance).toMatchObject({
      income: 8000,
      outcome: 6000,
      total: 2000
    });
  });
  it('should be able to create new transaction', async () => {
    const transactionsRepository = (0, _typeorm.getRepository)(_Transaction.default);
    const response = await (0, _supertest.default)(_app.default).post('/transactions').send({
      title: 'March Salary',
      type: 'income',
      value: 4000,
      category: 'Salary'
    });
    const transaction = await transactionsRepository.findOne({
      where: {
        title: 'March Salary'
      }
    });
    expect(transaction).toBeTruthy();
    expect(response.body).toMatchObject(expect.objectContaining({
      id: expect.any(String)
    }));
  });
  it('should create tags when inserting new transactions', async () => {
    const transactionsRepository = (0, _typeorm.getRepository)(_Transaction.default);
    const categoriesRepository = (0, _typeorm.getRepository)(_Category.default);
    const response = await (0, _supertest.default)(_app.default).post('/transactions').send({
      title: 'March Salary',
      type: 'income',
      value: 4000,
      category: 'Salary'
    });
    const category = await categoriesRepository.findOne({
      where: {
        title: 'Salary'
      }
    });
    expect(category).toBeTruthy();
    const transaction = await transactionsRepository.findOne({
      where: {
        title: 'March Salary',
        category_id: category === null || category === void 0 ? void 0 : category.id
      }
    });
    expect(transaction).toBeTruthy();
    expect(response.body).toMatchObject(expect.objectContaining({
      id: expect.any(String)
    }));
  });
  it('should not create tags when they already exists', async () => {
    const transactionsRepository = (0, _typeorm.getRepository)(_Transaction.default);
    const categoriesRepository = (0, _typeorm.getRepository)(_Category.default);
    const {
      identifiers
    } = await categoriesRepository.insert({
      title: 'Salary'
    });
    const insertedCategoryId = identifiers[0].id;
    await (0, _supertest.default)(_app.default).post('/transactions').send({
      title: 'March Salary',
      type: 'income',
      value: 4000,
      category: 'Salary'
    });
    const transaction = await transactionsRepository.findOne({
      where: {
        title: 'March Salary',
        category_id: insertedCategoryId
      }
    });
    const categoriesCount = await categoriesRepository.find();
    expect(categoriesCount).toHaveLength(1);
    expect(transaction).toBeTruthy();
  });
  it('should not be able to create outcome transaction without a valid balance', async () => {
    await (0, _supertest.default)(_app.default).post('/transactions').send({
      title: 'March Salary',
      type: 'income',
      value: 4000,
      category: 'Salary'
    });
    const response = await (0, _supertest.default)(_app.default).post('/transactions').send({
      title: 'iPhone',
      type: 'outcome',
      value: 4500,
      category: 'Eletronics'
    });
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(expect.objectContaining({
      status: 'error',
      message: expect.any(String)
    }));
  });
  it('should be able to delete a transaction', async () => {
    const transactionsRepository = (0, _typeorm.getRepository)(_Transaction.default);
    const response = await (0, _supertest.default)(_app.default).post('/transactions').send({
      title: 'March Salary',
      type: 'income',
      value: 4000,
      category: 'Salary'
    });
    await (0, _supertest.default)(_app.default).delete(`/transactions/${response.body.id}`);
    const transaction = await transactionsRepository.findOne(response.body.id);
    expect(transaction).toBeFalsy();
  });
  it('should be able to import transactions', async () => {
    const transactionsRepository = (0, _typeorm.getRepository)(_Transaction.default);
    const categoriesRepository = (0, _typeorm.getRepository)(_Category.default);

    const importCSV = _path.default.resolve(__dirname, 'import_template.csv');

    await (0, _supertest.default)(_app.default).post('/transactions/import').attach('file', importCSV);
    const transactions = await transactionsRepository.find();
    const categories = await categoriesRepository.find();
    expect(categories).toHaveLength(2);
    expect(categories).toEqual(expect.arrayContaining([expect.objectContaining({
      title: 'Others'
    }), expect.objectContaining({
      title: 'Food'
    })]));
    expect(transactions).toHaveLength(3);
    expect(transactions).toEqual(expect.arrayContaining([expect.objectContaining({
      title: 'Loan',
      type: 'income'
    }), expect.objectContaining({
      title: 'Website Hosting',
      type: 'outcome'
    }), expect.objectContaining({
      title: 'Ice cream',
      type: 'outcome'
    })]));
  });
});