"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Category = _interopRequireDefault(require("../models/Category"));

var _typeorm = require("typeorm");

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CategoriesRepository = (_dec = (0, _typeorm.EntityRepository)(_Category.default), _dec(_class = class CategoriesRepository extends _typeorm.Repository {// private categories: Category[];
  // constructor() {
  //   this.categories = [];
  // }
  // public all(): Category[] {
  //   return this.categories;
  // }
  // public create({title}: CreateCategoryDTO): Category {
  //   const category = new Category({
  //     title,
  //   });
  //   this.categories.push(category);
  //   return category;
  // }
}) || _class);
var _default = CategoriesRepository;
exports.default = _default;