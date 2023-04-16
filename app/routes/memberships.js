/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  var body = {
    heroTitle: 'Memberships',
    heroSubtitle: 'Join Our Community Today',
    heroImg: 'assets/images/drone-22.jpg'
  };
  // render the page
  res.render('memberships', body);
});

module.exports = router;
