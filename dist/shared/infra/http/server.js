"use strict";

require("reflect-metadata");

require("dotenv/config");

var _express = _interopRequireDefault(require("express"));

require("express-async-errors");

var _cors = _interopRequireDefault(require("cors"));

var _celebrate = require("celebrate");

var _upload = _interopRequireDefault(require("../../../config/upload"));

var _AppError = _interopRequireDefault(require("../../errors/AppError"));

var _RateLimiter = _interopRequireDefault(require("./middlewares/RateLimiter"));

var _routes = _interopRequireDefault(require("./routes"));

require("../typeorm");

require("../../container");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * TSyringe dependency injection container
 */
const app = (0, _express.default)();

_routes.default.use('/files', _express.default.static(_upload.default.uploadsFolder));

app.use(_RateLimiter.default); // use RateLimiter after files

app.use((0, _cors.default)({
  origin: ['http://localhost:3000', 'http://192.168.25.9:3000']
}));
app.use(_express.default.json());
app.use(_routes.default);
app.use((0, _celebrate.errors)());
app.use((err, req, res, noUnusedVars) => {
  if (err instanceof _AppError.default) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});
app.listen(3333, () => {
  console.log('🚀 Server Start');
});