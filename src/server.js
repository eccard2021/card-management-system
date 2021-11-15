import express from 'express'
import { connectDB } from '@src/config/db'
import env from '@src/config/environment'
import { notFound, errHandler } from '@src/middlewares/error.middleware'
import { apiV1 } from './routes/v1'

connectDB()
  .then(() => console.log('Connected succesfully to database server!'))
  .then(() => bootServer())
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

const bootServer = async () => {
  const app = express()
  app.use(express.json())
  app.use('/v1', apiV1)
  app.use(notFound)
  app.use(errHandler)

  app.listen(env.PORT, env.HOST, () => {
    console.log(`API Bank Management on ${env.HOST}:${env.PORT}`)
  })
}
