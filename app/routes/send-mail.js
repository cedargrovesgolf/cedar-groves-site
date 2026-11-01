const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const transporter = require('../helper/transporter');
const validator = require('validator');

const sendMailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many messages sent, please try again in an hour'
});

const isText = (value, maxLength) =>
  typeof value === 'string' && value.length <= maxLength;

router.post('/', sendMailLimiter, async (req, res) => {
  const { firstName, lastName, to, subject, message, honeypot, recaptchaResponse } = req.body;

  if (honeypot?.length) {
    return res.redirect('/contact#submitted');
  }

  if (
    !isText(firstName, 100) ||
    !isText(lastName, 100) ||
    !isText(subject, 200) ||
    !isText(message, 5000) ||
    !isText(recaptchaResponse, 4000)
  ) {
    req.session.sentError = 'Please check your message and try again.';
    return res.redirect('/contact#submitted');
  }

  if (typeof to !== 'string' || !validator.isEmail(to)) {
    req.session.sentError = 'Invalid email address.';
    return res.redirect('/contact#submitted');
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaResponse,
        remoteip: req.ip
      })
    });
    const data = await response.json();

    if (!data.success) {
      req.session.sentError = 'reCAPTCHA verification failed. Please try again.';
      return res.redirect('/contact#submitted');
    }
  } catch (error) {
    req.session.sentError = 'An error occurred during reCAPTCHA verification.';
    return res.redirect('/contact#submitted');
  }
  
  const clientMessage = `Hello,

Thank you for contacting Cedar Groves Golf Course. We have received your message and will get back to you as soon as possible.

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
