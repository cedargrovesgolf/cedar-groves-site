import crypto from 'node:crypto'
import helmet from 'helmet'
import config from '../config.js'

const assets =config.production ? [] : ['https://cedargrovesgolf.ca']

const cspNonce = (req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64')
  next()
}

const headers = helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [
        "'self'",
        (req, res) => `'nonce-${res.locals.cspNonce}'`,
        'https://www.google.com/recaptcha/',
        'https://www.gstatic.com/recaptcha/',
        'https://weatherwidget.io'
      ],
      imgSrc: ["'self'", 'data:', ...assets],
      mediaSrc: ["'self'", ...assets],
      frameSrc: [
        'https://www.google.com/recaptcha/',
        'https://recaptcha.google.com/recaptcha/',
        'https://weatherwidget.io'
      ]
    }
  }
})

export default [cspNonce, headers]
