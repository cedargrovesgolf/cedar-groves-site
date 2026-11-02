const crypto = require('crypto')

const trustProxy = process.env.TRUST_PROXY ?? '1'

module.exports = {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  trustProxy: /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy,
  sessionSecret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  originSecret: process.env.ORIGIN_SECRET,
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
  contactEmail: process.env.EMAIL,
  fromEmail: process.env.FROM_EMAIL,
  configTable: process.env.CONFIG_TABLE,
  cmsUsersTable: process.env.CMS_USERS_TABLE
}
