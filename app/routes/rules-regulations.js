/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  var body = {
    heroTitle: 'Rules & Regulations',
    heroSubtitle: 'Your Guide to Our Course Regulations',
    heroImg: 'https://cedar-groves-assets.s3.us-east-2.amazonaws.com/images/drone-6.jpg'
  };
  // render the page
  res.render('rules-regulations', body);
});

module.exports = router;
