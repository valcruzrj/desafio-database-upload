"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _Transaction = _interopRequireDefault(require("../models/Transaction"));

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let TransactionsRepository = (_dec = (0, _typeorm.EntityRepository)(_Transaction.default), _dec(_class = class TransactionsRepository extends _typeorm.Repository {
  async getBalance() {
    const transactions = await this.find();
    const {
      income,
      outcome
    } = transactions.reduce((accumulator, transaction) => {
      switch (transaction.type) {
        case "income":
          accumulator.income += Number(transaction.value);
          break;

        case "outcome":
          accumulator.outcome += Number(transaction.value);
          break;

        default:
          break;
      }

      return accumulator;
    }, {
      income: 0,
      outcome: 0,
      total: 0
    });
    const total = income - outcome;
    return {
      income,
      outcome,
      total
    };
  }

}) || _class);
var _default = TransactionsRepository;
exports.default = _default;