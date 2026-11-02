const crypto = require('crypto')
const { originSecret } = require('../config')

const sha256 = value => crypto.createHash('sha256').update(value).digest()
const expected = originSecret ? sha256(originSecret) : null

const cloudfront = (req, res, next) => {
  if (expected && !crypto.timingSafeEqual(sha256(req.get('x-origin-verify') ?? ''), expected)) {
    return res.sendStatus(403)
  }
  next()
}

module.exports = cloudfront
