import express from 'express'
import { connectDB } from '@src/config/db'
import env from '@src/config/environment'
import { notFound, errHandler } from '@src/middlewares/error.middleware'
import { apiV1 } from './routes/v1'
import { apiV2 } from './routes/v2'
import cors from 'cors'
import { corsOptions } from './utilities/constant'
import helmet from 'helmet'
import { scheduler } from './services/cornjob.service'

connectDB()
  .then(() => console.log('Connected succesfully to database server!'))
  .then(() => bootServer())
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

scheduler()

const bootServer = async () => {
  const app = express()
  app.use(cors(corsOptions))
  app.use(helmet())
  app.use(express.json({ limit: '100kb' }))
  app.use('/v1', apiV1)
  app.use('/v2', apiV2)
  app.use(notFound)
  app.use(errHandler)
  app.listen(process.env.PORT || env.APP_PORT, () => {
    console.log(`API Bank Management on port ${process.env.PORT || env.APP_PORT}`)
  })
}
