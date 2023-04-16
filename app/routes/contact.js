/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  var body = {
    heroTitle: 'Contact Us',
    heroSubtitle: 'Let Us Know How We Can Help',
    heroImg: 'assets/images/drone-20.jpg'
  };
  // render the page
  res.render('contact', body);
});

module.exports = router;
