import express from 'express'
import { HttpStatusCode } from '@src/utilities/constant'
import { userRoutes } from './user.route'
import { cardTypeRoutes } from './cardType.route'
import { transactionLogRoutes } from './transactionLog.route'

const router = express.Router()

/**
 * GET v1/status
 */

router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

/**User API */
router.use('/user', userRoutes)
/**CardType API */
router.use('/card-type', cardTypeRoutes)
/**Transaction Log API */
router.use('/transaction-logs', transactionLogRoutes)

export const apiV1 = router