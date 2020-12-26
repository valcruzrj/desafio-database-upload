"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _TransactionsRepository = _interopRequireDefault(require("../repositories/TransactionsRepository"));

var _Category = _interopRequireDefault(require("../models/Category"));

var _AppError = _interopRequireDefault(require("../errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateTransactionService {
  async execute({
    title,
    value,
    type,
    category
  }) {
    const transactionsRepository = (0, _typeorm.getCustomRepository)(_TransactionsRepository.default);
    const categoryRepository = (0, _typeorm.getRepository)(_Category.default);
    const {
      total
    } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new _AppError.default('You do not have enough balance');
    }

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category
      }
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category
      });
      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }

}

var _default = CreateTransactionService;
exports.default = _default;