import express from 'express'
import { authenticate } from '../../lib/auth.js'
import { reply } from '../../lib/reply.js'
import { loginLimiter } from '../../middleware/rate-limit.js'

const router = express.Router()

const sessionTtl = 12 * 60 * 60 * 1000
const rememberMeTtl = 30 * 24 * 60 * 60 * 1000

router.post('/', loginLimiter, async (req, res) => {
  const { username, password, rememberMe } = req.body ?? {}

  if (await authenticate(username, password)) {
    const expiresAt = Date.now() + (rememberMe ? rememberMeTtl : sessionTtl)
    req.session = { loggedin: true, username, expiresAt }
    req.sessionOptions.expires = new Date(expiresAt)
    return reply(res, 200, 'success', 'Logged in.', { redirect: '/cms' })
  }

  return reply(res, 401, 'error', 'Incorrect username or password. Please try again.')
})

export default router
