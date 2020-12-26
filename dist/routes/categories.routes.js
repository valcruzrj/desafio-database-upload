"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _typeorm = require("typeorm");

var _CategoriesRepository = _interopRequireDefault(require("../repositories/CategoriesRepository"));

var _CreateCategoryService = _interopRequireDefault(require("../services/CreateCategoryService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const categoriesRouter = (0, _express.Router)();
const categoriesRepository = new _CategoriesRepository.default();
categoriesRouter.get('/', async (request, response) => {
  const categoryRepository = (0, _typeorm.getCustomRepository)(_CategoriesRepository.default);
  const categories = await categoryRepository.find();
  return response.json({
    categories
  });
});
categoriesRouter.post('/', async (request, response) => {
  const {
    title
  } = request.body;
  const createCategory = new _CreateCategoryService.default();
  const category = await createCategory.execute({
    title
  });
  return response.json(category);
});
var _default = categoriesRouter;
exports.default = _default;