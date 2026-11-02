const cookieSession = require('cookie-session')
const { isProduction, sessionSecret } = require('../config')

const cookies = cookieSession({
  name: 'session',
  keys: [sessionSecret],
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax'
})

const expireLogin = (req, res, next) => {
  const { expiresAt } = req.session
  if (expiresAt && expiresAt <= Date.now()) {
    delete req.session.loggedin
    delete req.session.username
    delete req.session.expiresAt
  } else if (expiresAt) {
    req.sessionOptions.expires = new Date(expiresAt)
  }
  next()
}

module.exports = [cookies, expireLogin]
