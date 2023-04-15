/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  var body = {
    hero_title: 'About Us',
    hero_subtitle: 'Find Out What Makes Us Unique',
    hero_img: 'assets/images/drone-12.jpg'
  };
  // render the page
  res.render('about', body);
});

module.exports = router;
