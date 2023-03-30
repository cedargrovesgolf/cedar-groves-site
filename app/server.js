/* server.js */

/* imports */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

/* config */
const port = 3010 || 3000;

/* app */
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log('\033[0;32m------------------------------------------------');
  console.log('| Cedar Groves Executive Par 3 & Driving Range |');
  console.log('------------------------------------------------\033[0m\n');
  console.log(
    '\033[1;34m* Web application has been deployed and is running successfully *\033[0m\n'
  );
});

app.get('/', async function (req, res) {
  var body = {
    hero_title: 'Cedar Groves Executive<br>Par 3 & Driving Range',
    hero_subtitle: 'Golf Course & Country Club',
    hero_img: 'assets/images/drone-1.jpg',
  };
  // render the page
  res.render(__dirname + '/views/index', body);
});

app.get('/rates-fees', async function (req, res) {
  var body = {
    hero_title: 'Rates & Fees',
    hero_subtitle: 'Affordable Golf for Every Player',
    hero_img: 'assets/images/drone-2.jpg',
  };
  // render the page
  res.render(__dirname + '/views/rates-fees', body);
});

app.get('/aerial-tour', async function (req, res) {
  var body = {
    hero_title: 'Aerial Tour',
    hero_subtitle: 'Take Your Swing to New Heights',
    hero_img: 'assets/images/drone-8.jpg',
  };

  let hole = req.query.hole;
  if (typeof hole !== 'undefined') {
    let holeInfo = {
      1: {
        hole: 1,
        yardage: [20, 10, 5],
        par: 3,
        desc: 'This is a hole',
      },
    };

    body = {
      ...body,
      ...holeInfo[hole],
      url: `hole-${hole}.mov`,
    };
  }

  // render the page
  res.render(__dirname + '/views/aerial-tour', body);
});

app.get('/memberships', async function (req, res) {
  var body = {
    hero_title: 'Memberships',
    hero_subtitle: 'Join Our Community Today',
    hero_img: 'assets/images/drone-22.jpg',
  };
  // render the page
  res.render(__dirname + '/views/memberships', body);
});

app.get('/faq', async function (req, res) {
  var body = {
    hero_title: 'Frequently Asked Questions',
    hero_subtitle: 'Your Questions, Answered',
    hero_img: 'assets/images/drone-14.jpg',
  };
  // render the page
  res.render(__dirname + '/views/faq', body);
});

app.get('/contact', async function (req, res) {
  var body = {
    hero_title: 'Contact Us',
    hero_subtitle: 'Let Us Know How We Can Help',
    hero_img: 'assets/images/drone-20.jpg',
  };
  // render the page
  res.render(__dirname + '/views/contact', body);
});

app.get('/about', async function (req, res) {
  var body = {
    hero_title: 'About Us',
    hero_subtitle: 'Find Out What Makes Us Unique',
    hero_img: 'assets/images/drone-12.jpg',
  };
  // render the page
  res.render(__dirname + '/views/about', body);
});

app.get('/rules-regulations', async function (req, res) {
  var body = {
    hero_title: 'Rules & Regulations',
    hero_subtitle: 'Your Guide to Our Course Regulations',
    hero_img: 'assets/images/drone-6.jpg',
  };
  // render the page
  res.render(__dirname + '/views/rules-regulations', body);
});
