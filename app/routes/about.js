/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  var body = {
    heroTitle: 'About Us',
    heroSubtitle: 'Find Out What Makes Us Unique',
    heroImg: 'https://cedar-groves-assets.s3.us-east-2.amazonaws.com/images/drone-12.jpg'
  };
  // render the page
  res.render('about', body);
});

module.exports = router;
