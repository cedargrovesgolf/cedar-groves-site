/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  var body = {
    heroTitle: 'Rules & Regulations',
    heroSubtitle: 'Your Guide to Our Course Regulations',
    heroImg: 'assets/images/drone-6.jpg'
  };
  // render the page
  res.render('rules-regulations', body);
});

module.exports = router;
