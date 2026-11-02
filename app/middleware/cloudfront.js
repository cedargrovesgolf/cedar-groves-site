import crypto from 'node:crypto'
import config from '../config.js'

const sha256 = value => crypto.createHash('sha256').update(value).digest()
const expected = config.originSecret ? sha256(config.originSecret) : null

const cloudfront = (req, res, next) => {
  if (expected && !crypto.timingSafeEqual(sha256(req.get('x-origin-verify') ?? ''), expected)) {
    return res.sendStatus(403)
  }
  next()
}

export default cloudfront
