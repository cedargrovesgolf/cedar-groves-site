/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  var body = {
    heroTitle: 'Memberships',
    heroSubtitle: 'Join Our Community Today',
    heroImg: 'https://cedar-groves-assets.s3.us-east-2.amazonaws.com/images/drone-22.jpg'
  };
  // render the page
  res.render('memberships', body);
});

module.exports = router;
