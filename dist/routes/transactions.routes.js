"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _multer = _interopRequireDefault(require("multer"));

var _TransactionsRepository = _interopRequireDefault(require("../repositories/TransactionsRepository"));

var _CreateTransactionService = _interopRequireDefault(require("../services/CreateTransactionService"));

var _typeorm = require("typeorm");

var _DeleteTransactionService = _interopRequireDefault(require("../services/DeleteTransactionService"));

var _ImportTransactionsService = _interopRequireDefault(require("../services/ImportTransactionsService"));

var _upload = _interopRequireDefault(require("../config/upload"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const upload = (0, _multer.default)(_upload.default);
const transactionsRouter = (0, _express.Router)();
transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = (0, _typeorm.getCustomRepository)(_TransactionsRepository.default);
  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();
  return response.json({
    transactions,
    balance
  });
});
transactionsRouter.post('/', async (request, response) => {
  const {
    title,
    value,
    type,
    category
  } = request.body;
  const createTransaction = new _CreateTransactionService.default();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category
  });
  return response.json(transaction);
});
transactionsRouter.delete('/:id', async (request, response) => {
  const {
    id
  } = request.params;
  const deleteTransaction = new _DeleteTransactionService.default();
  await deleteTransaction.execute(id);
  return response.status(204).send();
});
transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTransactiions = new _ImportTransactionsService.default();
  const transaction = await importTransactiions.execute(request.file.path);
  return response.json(transaction);
});
var _default = transactionsRouter;
exports.default = _default;