const express = require('express');
const router = express.Router();
const transporter = require('../helper/transporter');

router.post('/', (req, res) => {
  const { firstName, lastName, to, subject, message } = req.body;

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
      res.redirect('/contact#submitted');
    } else {
      req.session.sentSuccess = 'Sent. Thank you for your feedback!';
      res.redirect('/contact#submitted');
    }
  });
});

module.exports = router;
