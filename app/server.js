/* server.js */
require('dotenv').config({ path: './app/.env' });

/* imports */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');

/* config */
const port = process.env.PORT || 3000;

/* app */
const app = express();

/* middlewares */
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false
  })
);

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

const updateHours = require('./routes/cms/update-hours');
app.use('/cms/update-hours', updateHours);

const logout = require('./routes/cms/logout');
app.use('/logout', logout);

const pageNotFound = require('./routes/404');
app.use(pageNotFound);

app.listen(port, () => {
  const appMsg = `
Server started ! \u001B[32m✓\u001B[0m\x1B[3m\n\n\u001b[36;1mAccess URL:\u001b[0m\x1B[0m
---------------------
http://localhost:${port}
---------------------`;
  console.log(appMsg);
});
