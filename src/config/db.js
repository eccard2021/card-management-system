import mongoose from 'mongoose'
import env from '@src/config/environment.js'



export const connectDB = async () => {
  const conn = await mongoose.connect(env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true
  })
  console.log(`Connected to MongoDB host: ${conn.connection.host}`)
}
