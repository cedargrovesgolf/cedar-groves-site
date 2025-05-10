/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  var body = {
    heroTitle: 'Frequently Asked Questions',
    heroSubtitle: 'Your Questions, Answered',
    heroImg: 'https://cedar-groves-assets.s3.us-east-2.amazonaws.com/images/drone-14.jpg'
  };
  // render the page
  res.render('faq', body);
});

module.exports = router;
