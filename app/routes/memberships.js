/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  var body = {
    hero_title: 'Memberships',
    hero_subtitle: 'Join Our Community Today',
    hero_img: 'assets/images/drone-22.jpg'
  };
  // render the page
  res.render('memberships', body);
});

module.exports = router;
