import { HttpStatusCode } from '@src/utilities/constant'
const notFound = (req, res, next) => {
  const error = new Error(`not found - ${req.originalUrl}`)
  res.status(HttpStatusCode.NOT_FOUND)
  next(error)
}

const errHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === HttpStatusCode.OK ? HttpStatusCode.INTERNAL_SERVER : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  })
  next('route')
}

export { notFound, errHandler }