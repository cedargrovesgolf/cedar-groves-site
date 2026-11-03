import crypto from 'node:crypto'
import helmet from 'helmet'
import config from '../config.js'

const assets = config.production ? [] : ['https://cedargrovesgolf.ca']
const devServer = config.production ? [] : ['http://localhost:5173']
const devSocket = config.production ? [] : ['ws://localhost:5173']
const uploads = config.assetsBucket
  ? [`https://${config.assetsBucket}.s3.amazonaws.com`, `https://${config.assetsBucket}.s3.us-east-1.amazonaws.com`]
  : []

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
        'https://weatherwidget.io',
        ...devServer
      ],
      imgSrc: ["'self'", 'data:', 'blob:', ...assets, ...devServer],
      fontSrc: ["'self'", 'https:', 'data:', ...devServer],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'", ...devServer],
      mediaSrc: ["'self'", ...assets],
      connectSrc: ["'self'", ...uploads, ...devServer, ...devSocket],
      upgradeInsecureRequests: config.production ? [] : null,
      frameSrc: [
        'https://www.google.com/recaptcha/',
        'https://recaptcha.google.com/recaptcha/',
        'https://weatherwidget.io'
      ]
    }
  }
})

export default [cspNonce, headers]
