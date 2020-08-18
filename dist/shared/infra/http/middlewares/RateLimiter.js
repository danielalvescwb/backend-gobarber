"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rateLimiter;

var _redis = _interopRequireDefault(require("redis"));

var _rateLimiterFlexible = require("rate-limiter-flexible");

var _AppError = _interopRequireDefault(require("../../../errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const storeClient = _redis.default.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined
});

const {
  points,
  duration,
  keyPrefix,
  blockDuration
} = {
  points: 20,
  // requests
  duration: 2,
  // per 1 second by IP
  keyPrefix: 'ratelimit',
  blockDuration: 30
};
const limiter = new _rateLimiterFlexible.RateLimiterRedis({
  storeClient,
  keyPrefix,
  points,
  duration,
  blockDuration
});

async function rateLimiter(req, res, next) {
  try {
    await limiter.consume(req.ip);
    return next();
  } catch (error) {
    throw new _AppError.default('Too Many Requests', 429);
  }
}