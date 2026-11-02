const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2')

const ses = new SESv2Client()

const sendMail = async ({ from, to, replyTo, subject, text }) => {
  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: replyTo ? [replyTo] : undefined,
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: { Text: { Data: text } }
        }
      }
    })
  )
}

module.exports = { sendMail }
