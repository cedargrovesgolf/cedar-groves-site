const express = require('express');
const router = express.Router();
const transporter = require('./transporter');

router.post('/', async (req, res) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.message
  };

  await transporter.sendMail(mailOptions, err => {
    if (err) {
      console.error(err);
      res.redirect('/contact?sent=0');
    } else {
      res.redirect('/contact?sent=1');
    }
  });
});

module.exports = router;
