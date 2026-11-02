import path from 'node:path'
import express from 'express'
import config from './config.js'
import cloudfront from './middleware/cloudfront.js'
import helmet from './middleware/helmet.js'
import session from './middleware/session.js'
import csrf from './middleware/csrf.js'
import { globalLimiter } from './middleware/rate-limit.js'
import errors from './middleware/errors.js'
import vendor from './middleware/vendor.js'
import routes from './routes/index.js'
import pageNotFound from './routes/404.js'

const app = express()

app.set('trust proxy', config.trustProxy)
app.set('view engine', 'ejs')
app.set('views', path.join(import.meta.dirname, 'views'))

app.get('/health', (req, res) => res.status(200).send('OK'))

app.use(cloudfront)
app.use(helmet)
if (!config.production) {
  app.use('/assets', (req, res) => res.redirect(`https://cedargrovesgolf.ca/assets${req.url}`))
}
app.use(express.static(path.join(import.meta.dirname, 'public')))
app.use('/vendor', vendor)
app.use(express.urlencoded({ extended: true }))
app.use(session)
app.use(csrf)
app.use(globalLimiter)
app.use(routes)
app.use(pageNotFound)
app.use(errors)

export default app
