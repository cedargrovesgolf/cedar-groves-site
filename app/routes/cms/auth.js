/* ./routes/cms/auth.js */
const express = require('express')
const router = express.Router()
const { authenticate } = require('../../lib/auth')
const { loginLimiter } = require('../../middleware/rate-limit')

const sessionTtl = 12 * 60 * 60 * 1000
const rememberMeTtl = 30 * 24 * 60 * 60 * 1000

router.post('/', loginLimiter, async (req, res) => {
  const { username, password, rememberMe } = req.body ?? {}

  if (await authenticate(username, password)) {
    const expiresAt = Date.now() + (rememberMe ? rememberMeTtl : sessionTtl)
    req.session = { loggedin: true, username, expiresAt }
    req.sessionOptions.expires = new Date(expiresAt)
    return res.redirect('/admin-cms')
  }

  req.session.failedLogIn = true
  res.redirect('/admin-cms')
})

module.exports = router
