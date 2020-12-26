"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _AppError = _interopRequireDefault(require("../errors/AppError"));

var _TransactionsRepository = _interopRequireDefault(require("../repositories/TransactionsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DeleteTransactionService {
  async execute(id) {
    const transactionRepository = (0, _typeorm.getCustomRepository)(_TransactionsRepository.default);
    const transaction = await transactionRepository.findOne(id);

    if (!transaction) {
      throw new _AppError.default('Transcation do not found');
    }

    await transactionRepository.remove(transaction);
  }

}

var _default = DeleteTransactionService;
exports.default = _default;