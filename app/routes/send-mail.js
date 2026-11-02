const express = require('express')
const router = express.Router()
const validator = require('validator')
const { sendMail } = require('../lib/mail')
const { contactLimiter } = require('../middleware/rate-limit')
const { recaptchaSecretKey, contactEmail, fromEmail } = require('../config')

const isText = (value, maxLength) =>
  typeof value === 'string' && value.length <= maxLength

const recaptchaHostname = 'cedargrovesgolf.ca'
const recaptchaMinScore = 0.5

const isHumanSubmission = data =>
  data.success === true &&
  data.action === 'submit' &&
  data.hostname === recaptchaHostname &&
  typeof data.score === 'number' &&
  data.score >= recaptchaMinScore

router.post('/', contactLimiter, async (req, res) => {
  const { firstName, lastName, to, subject, message, honeypot, recaptchaResponse } = req.body ?? {}

  if (honeypot?.length) {
    return res.redirect('/contact#submitted')
  }

  if (
    !isText(firstName, 100) ||
    !isText(lastName, 100) ||
    !isText(subject, 200) ||
    !isText(message, 5000) ||
    !isText(recaptchaResponse, 4000)
  ) {
    req.session.sentError = 'Please check your message and try again.'
    return res.redirect('/contact#submitted')
  }

  if (typeof to !== 'string' || !validator.isEmail(to)) {
    req.session.sentError = 'Invalid email address.'
    return res.redirect('/contact#submitted')
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: recaptchaSecretKey,
        response: recaptchaResponse,
        remoteip: req.ip
      })
    })
    const data = await response.json()

    if (!isHumanSubmission(data)) {
      req.session.sentError = 'reCAPTCHA verification failed. Please try again.'
      return res.redirect('/contact#submitted')
    }
  } catch {
    req.session.sentError = 'An error occurred during reCAPTCHA verification.'
    return res.redirect('/contact#submitted')
  }
  
  const clientMessage = `Hello,

Thank you for contacting Cedar Groves Golf Course. We have received your message and will get back to you as soon as possible.

Cedar Groves Executive Par 3 & Driving Range`

  const mailToClient = {
    from: `Cedar Groves Golf <${fromEmail}>`,
    to,
    subject: 'Feedback Received by Cedar Groves',
    text: clientMessage
  }

  const businessMessage = `The following feedback was sent by a customer:

From: ${firstName} ${lastName}
Email: ${to}

Subject: ${subject}
${message}`

  const mailToBusiness = {
    from: `Cedar Groves Golf <${fromEmail}>`,
    to: contactEmail,
    replyTo: to,
    subject: subject.replace(/[\r\n]+/g, ' '),
    text: businessMessage
  }

  try {
    await Promise.all([sendMail(mailToBusiness), sendMail(mailToClient)])
    req.session.sentSuccess = 'Sent. Thank you for your feedback!'
  } catch (error) {
    console.error(error)
    req.session.sentError = 'An error occurred while attempting to send your message.'
  }
  return res.redirect('/contact#submitted')
})

module.exports = router
