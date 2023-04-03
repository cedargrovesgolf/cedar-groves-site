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

app.listen(port, () => { });

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
        yardage: [125, 155, 168],
        par: 3,
        desc: 'Tee off high above Dolan Lake on this picturesque opening hole. With a small pond obstacle in play, accuracy and finesse are key to reaching the green on this hole. Surrounded by trees, this hole offers a peaceful yet demanding start to your round.'
      },
      2: {
        hole: 2,
        yardage: [75, 115, 125],
        par: 3,
        desc: 'This hole is tucked in the woods, surrounded by large trees, and features a stunning fairway. Located beside Hole 9, this hole presents a unique obstacle with trees situated in the fairway. Enjoy the natural surroundings of this hole and use them to your advantage to score well.',
      },
      3: {
        hole: 3,
        yardage: [75, 126, 132],
        par: 3,
        desc: 'This Par 3 is deceptively challenging, featuring a narrow, straight fairway and a small green that demands precision and a soft touch. Despite its flat terrain and straightforward layout, golfers will need to bring their best game to score well on this seemingly simple hole.'
      },
      4: {
        hole: 4,
        yardage: [64, 155, 170],
        par: 3,
        desc: 'This is a hole',
      },
      5: {
        hole: 5,
        yardage: [95, 115, 130],
        par: 3,
        desc: 'This is a hole',
      },
      6: {
        hole: 6,
        yardage: [46, 95, 120],
        par: 3,
        desc: 'This is a hole',
      },
      7: {
        hole: 7,
        yardage: [135, 265, 270],
        par: 4,
        desc: 'This is a hole',
      },
      8: {
        hole: 8,
        yardage: [180, 265, 275],
        par: 4,
        desc: 'This is a hole',
      },
      9: {
        hole: 9,
        yardage: [116, 160, 165],
        par: 3,
        desc: 'This is a hole',
      }
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
