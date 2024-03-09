const express = require('express');
const router = express.Router();
const transporter = require('../helper/transporter');
const validator = require('validator');

router.post('/', async (req, res) => {
  const { firstName, lastName, to, subject, message, honeypot, recaptchaResponse } = req.body;

  if (!validator.isEmail(to)) {
    req.session.sentError = 'Invalid email address.';
    return res.redirect('/contact#submitted');
  }

  if (honeypot?.length) {
    return res.redirect('/contact#submitted');
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const captchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
  try {
    const response = await fetch(captchaUrl, { method: 'POST' });
    const data = await response.json();
    console.log(data)

    if (!data.success) {
      req.session.sentError = 'reCAPTCHA verification failed. Please try again.';
      return res.redirect('/contact#submitted');
    }
  } catch (error) {
    req.session.sentError = 'An error occurred during reCAPTCHA verification.';
    res.redirect('/contact#submitted');
  }
  
  const clientMessage = `Dear ${firstName} ${lastName},
The following message was received by Cedar Groves Golf Course:

From: ${firstName} ${lastName}
Email: ${to}

Subject: ${subject}
${message}

Thank you for your feedback,
Cedar Groves Executive Par 3 & Driving Range`;

  const mailToClient = {
    from: `Cedar Groves Golf <${process.env.FROM_EMAIL}>`,
    to: to,
    subject: 'Feedback Received by Cedar Groves',
    text: clientMessage
  };

  const businessMessage = `The following feedback was sent by a customer:

From: ${firstName} ${lastName}
Email: ${to}

Subject: ${subject}
${message}`;

  const mailToBusiness = {
    from: `Cedar Groves Golf <${process.env.FROM_EMAIL}>`,
    to: process.env.EMAIL,
    subject: subject,
    text: businessMessage
  };


  transporter.sendMail(mailToBusiness, error => {
    if (error) {
      console.error(error);
    }
  });

  transporter.sendMail(mailToClient, error => {
    if (error) {
      console.error(error);
      req.session.sentError =
        'An error occurred while attempting to send your message.';
    } else {
      req.session.sentSuccess = 'Sent. Thank you for your feedback!';
    }
    return res.redirect('/contact#submitted');
  });
});

module.exports = router;
