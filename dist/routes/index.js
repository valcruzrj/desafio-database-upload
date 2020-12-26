"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _transactions = _interopRequireDefault(require("./transactions.routes"));

var _categories = _interopRequireDefault(require("./categories.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = (0, _express.Router)();
routes.use('/transactions', _transactions.default);
routes.use('/categories', _categories.default);
var _default = routes;
exports.default = _default;