import nodemailer from 'nodemailer'
import env from '@src/config/environment'

const adminEmail = env.ADMIN_EMAIL
const adminPassword = env.ADMIN_PASSWORD
const mailHost = 'smtp.gmail.com'
const mailPort = 465

const sendMail = (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: true,
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  })

  const options = {
    from: adminEmail,
    to: to,
    subject: subject,
    html: htmlContent
  }
  return transporter.sendMail(options)
}

export default sendMail