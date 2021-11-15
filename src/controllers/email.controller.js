import sendMail from '@src/utilities/mailer'

const sendEmail = async (to, subject, body) => {
  try {
    await sendMail(to, subject, body)
  } catch (error) {
    throw new Error('Cannot send email')
  }
}
export default sendEmail