/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  var body = {
    heroTitle: 'Contact Us',
    heroSubtitle: 'Let Us Know How We Can Help',
    heroImg: 'assets/images/drone-20.jpg',
    sentSuccess: req.session.sentSuccess ?? null,
    sentError: req.session.sentError ?? null
  };
  delete req.session.sentSuccess;
  delete req.session.sentError;
  // render the page
  res.render('contact', body);
});

module.exports = router;
