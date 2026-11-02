const crypto = require('crypto')
const helmet = require('helmet')

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
        'https://cdn.jsdelivr.net',
        'https://code.jquery.com',
        'https://www.google.com/recaptcha/',
        'https://www.gstatic.com/recaptcha/',
        'https://weatherwidget.io'
      ],
      imgSrc: ["'self'", 'data:'],
      mediaSrc: ["'self'"],
      frameSrc: [
        'https://www.google.com/recaptcha/',
        'https://recaptcha.google.com/recaptcha/',
        'https://weatherwidget.io'
      ]
    }
  }
})

module.exports = [cspNonce, headers]
