import express from 'express'
import { HttpStatusCode } from '@src/utilities/constant'
import { userRoutes } from './user.route'
import { cardTypeRoutes } from './cardType.route'
import { transactionLogRoutes } from './transactionLog.route'
import { orderRoutes } from './order.route'
import { paymentRoutes } from './payment.route'
import { cardRoutes } from './card.route'
import { paymentGatewayRoutes } from './paymentGateway.route'

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
/**Order API */
router.use('/order', orderRoutes)
/**Payment API */
router.use('/payment', paymentRoutes)
/**Card API */
router.use('/cards', cardRoutes)
/**Payment Gateway API */
router.use('/gateways', paymentGatewayRoutes)

export const apiV1 = router