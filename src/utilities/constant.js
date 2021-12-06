import env from '../config/environment'
export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  SERVICE_UNAVAILABLE: 503
}

export const SERVICE_ACTION_TYPE = {
  CHARGE: 'charge',
  WITHDRAW: 'withdraw',
  TRANSFER: 'transfer',
  PAYMENT: 'payment',
  MONTHLY_FEE: 'monthly_fee',
  SERVICE_FEE: 'service_fee'
}


let whitelist = [env.FRONTEND_HOSTNAME]
export const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true)
    // if (whitelist.indexOf(origin) !== -1) {
    //   callback(null, true)
    // } else {
    //   callback(new Error('Not allowed by CORS'))
    // }
  },
  credentials: true
}