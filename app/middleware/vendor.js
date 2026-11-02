import path from 'node:path'
import { createRequire } from 'node:module'
import express from 'express'

const require = createRequire(import.meta.url)
const packageDir = name => path.dirname(require.resolve(`${name}/package.json`))
const options = { maxAge: '1d', index: false }

const vendor = express.Router()

vendor.use('/bootstrap', express.static(path.join(packageDir('bootstrap'), 'dist'), options))
vendor.use('/bootstrap-icons', express.static(path.join(packageDir('bootstrap-icons'), 'font'), options))
vendor.use('/swiper', express.static(packageDir('swiper'), options))

export default vendor
