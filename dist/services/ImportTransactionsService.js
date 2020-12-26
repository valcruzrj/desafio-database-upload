"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _csvParse = _interopRequireDefault(require("csv-parse"));

var _fs = _interopRequireDefault(require("fs"));

var _typeorm = require("typeorm");

var _Category = _interopRequireDefault(require("../models/Category"));

var _TransactionsRepository = _interopRequireDefault(require("../repositories/TransactionsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ImportTransactionsService {
  async execute(filePath) {
    const transactionRepository = (0, _typeorm.getCustomRepository)(_TransactionsRepository.default);
    const categoriesRepository = (0, _typeorm.getRepository)(_Category.default);

    const contactRoadStream = _fs.default.createReadStream(filePath);

    const parsers = (0, _csvParse.default)({
      from_line: 2
    });
    const parseCSV = contactRoadStream.pipe(parsers);
    const transactions = [];
    const categories = [];
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map(cell => cell.trim());
      if (!title || !type || !value) return;
      categories.push(category);
      transactions.push({
        title,
        type,
        value,
        category
      });
    });
    await new Promise(resolve => parseCSV.on('end', resolve));
    const existentCategories = await categoriesRepository.find({
      where: {
        title: (0, _typeorm.In)(categories)
      }
    });
    const existentCategoriesTitles = existentCategories.map(category => category.title);
    const addCategoryTitle = categories.filter(category => !existentCategoriesTitles.includes(category)).filter((value, index, self) => self.indexOf(value) === index);
    const newCategories = categoriesRepository.create(addCategoryTitle.map(title => ({
      title
    })));
    await categoriesRepository.save(newCategories);
    const finalCategories = [...newCategories, ...newCategories];
    const createdTranscactions = transactionRepository.create(transactions.map(transaction => ({
      title: transaction.title,
      type: transaction.type,
      value: transaction.value,
      category: finalCategories.find(category => category.title === transaction.category)
    })));
    await transactionRepository.save(createdTranscactions);
    await _fs.default.promises.unlink(filePath);
    return createdTranscactions;
  }

}

var _default = ImportTransactionsService;
exports.default = _default;