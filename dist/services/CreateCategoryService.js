"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _CategoriesRepository = _interopRequireDefault(require("../repositories/CategoriesRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateCategoryService {
  async execute({
    title
  }) {
    const categoriesRepository = (0, _typeorm.getCustomRepository)(_CategoriesRepository.default);
    const category = categoriesRepository.create({
      title
    });
    await categoriesRepository.save(category);
    return category;
  }

}

var _default = CreateCategoryService;
exports.default = _default;