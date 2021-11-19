require('dotenv').config()

const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET
}

export default env