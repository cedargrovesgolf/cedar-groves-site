import express from 'express'
import config from '../../config.js'
import { reply } from '../../lib/reply.js'
import { completeSignIn, createSignIn, saveRefreshToken } from '../../services/google/oauth.js'
import { loginLimiter } from '../../middleware/rate-limit.js'

const router = express.Router()

const sessionTtl = 12 * 60 * 60 * 1000

const isCmsEmail = email =>
  typeof email === 'string' && Boolean(config.cmsEmail) && email.trim().toLowerCase() === config.cmsEmail.toLowerCase()

router.post('/', loginLimiter, async (req, res) => {
  const { email } = req.body ?? {}

  if (!isCmsEmail(email)) {
    return reply(res, 401, 'error', "This account can't sign in.")
  }

  try {
    const { url, codeVerifier, state } = await createSignIn(email.trim())
    req.session = { signIn: { email: email.trim(), url, codeVerifier, state } }
    return reply(res, 200, 'success', 'Continue with Google.', { redirect: '/cms' })
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error starting sign-in. Please try again.')
  }
})

router.get('/callback', async (req, res) => {
  const { signIn } = req.session
  req.session = null

  if (!signIn) {
    return res.redirect('/cms')
  }

  try {
    const { email, refreshToken } = await completeSignIn(req.originalUrl, signIn)
    if (!isCmsEmail(email)) {
      return res.redirect('/cms?error=account')
    }
    if (refreshToken) {
      await saveRefreshToken(refreshToken)
    }
    const expiresAt = Date.now() + sessionTtl
    req.session = { loggedin: true, expiresAt }
    req.sessionOptions.expires = new Date(expiresAt)
    return res.redirect('/cms')
  } catch (err) {
    console.error(err)
    return res.redirect('/cms?error=google')
  }
})

export default router
