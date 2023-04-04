/* server.js */

/* imports */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

/* config */
const port = process.env.PORT || 3000;

/* app */
const app = express();

/* middlewares */
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

/* routes */
const indexRouter = require('./routes/index');
const ratesFeesRouter = require('./routes/rates-fees');
const aerialTourRouter = require('./routes/aerial-tour');
const membershipsRouter = require('./routes/memberships');
const faqRouter = require('./routes/faq');
const contactRouter = require('./routes/contact');
const aboutRouter = require('./routes/about');
const rulesRegulationsRouter = require('./routes/rules-regulations');

app.use('/', indexRouter);
app.use('/rates-fees', ratesFeesRouter);
app.use('/aerial-tour', aerialTourRouter);
app.use('/memberships', membershipsRouter);
app.use('/faq', faqRouter);
app.use('/contact', contactRouter);
app.use('/about', aboutRouter);
app.use('/rules-regulations', rulesRegulationsRouter);

app.listen(port, () => { });