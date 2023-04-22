/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  var body = {
    heroTitle: 'Rates & Fees',
    heroSubtitle: 'Affordable Golf for Every Player',
    heroImg: 'assets/images/drone-2.jpg'
  };
  // render the page
  res.render('rates-fees', body);
});

module.exports = router;
