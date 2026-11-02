const express = require('express')
const path = require('path')
const config = require('./config')
const cloudfront = require('./middleware/cloudfront')
const helmet = require('./middleware/helmet')
const session = require('./middleware/session')
const csrf = require('./middleware/csrf')
const { globalLimiter } = require('./middleware/rate-limit')
const errors = require('./middleware/errors')
const routes = require('./routes')
const pageNotFound = require('./routes/404')

const app = express()

app.set('trust proxy', config.trustProxy)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/health', (req, res) => res.status(200).send('OK'))

app.use(cloudfront)
app.use(helmet)
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session)
app.use(csrf)
app.use(globalLimiter)
app.use(routes)
app.use(pageNotFound)
app.use(errors)

module.exports = app
