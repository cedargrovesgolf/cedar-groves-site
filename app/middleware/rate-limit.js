import { rateLimit } from 'express-rate-limit'

const minutes = 60 * 1000
const defaults = { standardHeaders: true, legacyHeaders: false }

export const globalLimiter = rateLimit({
  ...defaults,
  windowMs: 15 * minutes,
  limit: 500,
  message: 'Too many requests, please try again after 15 minutes'
})

export const loginLimiter = rateLimit({
  ...defaults,
  windowMs: 15 * minutes,
  limit: 10,
  message: { type: 'error', message: 'Too many login attempts, please try again after 15 minutes.' }
})

export const contactLimiter = rateLimit({
  ...defaults,
  windowMs: 60 * minutes,
  limit: 5,
  message: { type: 'error', message: 'Too many messages sent, please try again in an hour.' }
})
