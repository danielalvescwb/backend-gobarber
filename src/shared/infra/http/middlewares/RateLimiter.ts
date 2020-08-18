import { Request, Response, NextFunction } from 'express'
import redis from 'redis'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import AppError from '@shared/errors/AppError'

const storeClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
})
const { points, duration, keyPrefix, blockDuration } = {
  points: 20, // requests
  duration: 2, // per 1 second by IP
  keyPrefix: 'ratelimit',
  blockDuration: 30,
}

const limiter = new RateLimiterRedis({
  storeClient,
  keyPrefix,
  points,
  duration,
  blockDuration,
})

export default async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(req.ip)
    return next()
  } catch (error) {
    throw new AppError('Too Many Requests', 429)
  }
}
