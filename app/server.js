require('dotenv').config({ path: './app/.env' });

/* imports */
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

/* config */
const port = process.env.PORT || 3000;
const assetsOrigin = 'https://cedar-groves-assets.s3.us-east-2.amazonaws.com';

/* app */
const app = express();
app.set('trust proxy', 1);

/* middlewares */
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  next();
});
app.use(
  helmet({
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
        imgSrc: ["'self'", 'data:', assetsOrigin],
        mediaSrc: ["'self'", assetsOrigin],
        frameSrc: [
          'https://www.google.com/recaptcha/',
          'https://recaptcha.google.com/recaptcha/',
          'https://weatherwidget.io'
        ]
      }
    }
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(
  session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: 'lax' }
  })
);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again after 15 minutes'
}));

/* routes */
const index = require('./routes/index');
app.use('/', index);
const ratesFees = require('./routes/rates-fees');
app.use('/rates-fees', ratesFees);
const aerialTour = require('./routes/aerial-tour');
app.use('/aerial-tour', aerialTour);
const memberships = require('./routes/memberships');
app.use('/memberships', memberships);
const faq = require('./routes/faq');
app.use('/faq', faq);
const contact = require('./routes/contact');
app.use('/contact', contact);
const about = require('./routes/about');
app.use('/about', about);
const rulesRegulations = require('./routes/rules-regulations');
app.use('/rules-regulations', rulesRegulations);
const sendMail = require('./routes/send-mail');
app.use('/send-mail', sendMail);
const adminCms = require('./routes/cms/admin-cms');
app.use('/admin-cms', adminCms);
const auth = require('./routes/cms/auth');
app.use('/cms/auth', auth);
const updateConfig = require('./routes/cms/update-config');
app.use('/cms/update-config', updateConfig);
const logout = require('./routes/cms/logout');
app.use('/logout', logout);
app.get('/health', (req, res) => res.status(200).send('OK'));
const pageNotFound = require('./routes/404');
app.use(pageNotFound);

app.listen(port, () => console.log(`Server started on port: ${port}`));