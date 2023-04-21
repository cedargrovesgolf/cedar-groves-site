/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  var body = {
    heroTitle: 'Contact Us',
    heroSubtitle: 'Let Us Know How We Can Help',
    heroImg: 'assets/images/drone-20.jpg'
  };

  const sent = req.query.sent;
  body.sent = sent === '1' ? 'Sent. Thank you for your feedback!' : null;
  body.failedSent =
    sent === '0'
      ? 'An error occurred while attempting to send your message.'
      : null;

  // render the page
  res.render('contact', body);
});

module.exports = router;
