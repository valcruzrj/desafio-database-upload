"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("reflect-metadata");

require("dotenv/config");

var _express = _interopRequireDefault(require("express"));

require("express-async-errors");

var _routes = _interopRequireDefault(require("./routes"));

var _AppError = _interopRequireDefault(require("./errors/AppError"));

var _cors = _interopRequireDefault(require("cors"));

var _database = _interopRequireDefault(require("./database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _database.default)();
const app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use(_routes.default);
app.use((err, request, response, _) => {
  if (err instanceof _AppError.default) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  console.error(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});
var _default = app;
exports.default = _default;