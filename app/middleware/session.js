import cookieSession from 'cookie-session'
import config from '../config.js'

const cookies = cookieSession({
  name: 'session',
  keys: [config.sessionSecret],
  httpOnly: true,
  secure: config.production,
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

export default [cookies, expireLogin]
