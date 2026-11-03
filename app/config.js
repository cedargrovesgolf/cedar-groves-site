import crypto from 'node:crypto'

const trustProxy = process.env.TRUST_PROXY ?? '1'
const port = process.env.PORT || 3000

export default {
  production: process.env.NODE_ENV === 'production',
  port,
  siteUrl: process.env.SITE_URL || `http://localhost:${port}`,
  trustProxy: /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy,
  sessionSecret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  originSecret: process.env.ORIGIN_SECRET,
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
  contactEmail: process.env.EMAIL,
  fromEmail: process.env.FROM_EMAIL,
  configTable: process.env.CONFIG_TABLE,
  assetsBucket: process.env.ASSETS_BUCKET,
  cmsEmail: process.env.CMS_EMAIL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleLocation: process.env.GOOGLE_LOCATION
}
