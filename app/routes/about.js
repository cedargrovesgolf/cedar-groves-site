/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  var body = {
    heroTitle: 'About Us',
    heroSubtitle: 'Find Out What Makes Us Unique',
    heroImg: 'assets/images/drone-12.jpg'
  };
  // render the page
  res.render('about', body);
});

module.exports = router;
