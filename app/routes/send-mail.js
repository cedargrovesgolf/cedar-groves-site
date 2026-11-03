import express from 'express'
import validator from 'validator'
import { sendMail } from '../services/mail.js'
import { reply } from '../lib/reply.js'
import { contactLimiter } from '../middleware/rate-limit.js'
import config from '../config.js'

const router = express.Router()

const isText = (value, maxLength) =>
  typeof value === 'string' && value.length <= maxLength

const recaptchaHostname = config.production ? 'cedargrovesgolf.ca' : 'localhost'
const recaptchaMinScore = 0.5
const sentMessage = 'Sent. Thank you for your feedback!'

const isHumanSubmission = data =>
  data.success === true &&
  data.action === 'submit' &&
  data.hostname === recaptchaHostname &&
  typeof data.score === 'number' &&
  data.score >= recaptchaMinScore

router.post('/', contactLimiter, async (req, res) => {
  const { firstName, lastName, to, subject, message, honeypot, recaptchaResponse } = req.body ?? {}

  if (honeypot?.length) {
    return reply(res, 200, 'success', sentMessage)
  }

  if (
    !isText(firstName, 100) ||
    !isText(lastName, 100) ||
    !isText(subject, 200) ||
    !isText(message, 5000) ||
    !isText(recaptchaResponse, 4000)
  ) {
    return reply(res, 400, 'error', 'Please check your message and try again.')
  }

  if (typeof to !== 'string' || !validator.isEmail(to)) {
    return reply(res, 400, 'error', 'Invalid email address.')
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: config.recaptchaSecretKey,
        response: recaptchaResponse,
        remoteip: req.ip
      })
    })
    const data = await response.json()

    if (!isHumanSubmission(data)) {
      return reply(res, 400, 'error', 'reCAPTCHA verification failed. Please try again.')
    }
  } catch {
    return reply(res, 502, 'error', 'An error occurred during reCAPTCHA verification.')
  }

  const clientMessage = `Hello,

Thank you for contacting Cedar Groves Golf Course. We have received your message and will get back to you as soon as possible.

Cedar Groves Executive Par 3 & Driving Range`

  const mailToClient = {
    from: `Cedar Groves Golf <${config.fromEmail}>`,
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
    from: `Cedar Groves Golf <${config.fromEmail}>`,
    to: config.contactEmail,
    replyTo: to,
    subject: subject.replace(/[\r\n]+/g, ' '),
    text: businessMessage
  }

  try {
    await Promise.all([sendMail(mailToBusiness), sendMail(mailToClient)])
    return reply(res, 200, 'success', sentMessage)
  } catch (error) {
    console.error(error)
    return reply(res, 502, 'error', 'An error occurred while attempting to send your message.')
  }
})

export default router
