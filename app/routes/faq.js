/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  var body = {
    hero_title: 'Frequently Asked Questions',
    hero_subtitle: 'Your Questions, Answered',
    hero_img: 'assets/images/drone-14.jpg'
  };
  // render the page
  res.render('faq', body);
});

module.exports = router;
