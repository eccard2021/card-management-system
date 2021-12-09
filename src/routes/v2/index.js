import express from 'express'
import { adminRoutes } from './admin.route'
import { HttpStatusCode } from '../../utilities/constant'

const router = express.Router()

/**
 * GET v2/status
 */

router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

/**Admin API */
router.use('/admin', adminRoutes)
/**Users API */
// router.use('/users', userRoutes)
// /**CardType API */
// router.use('/card-type', cardTypeRoutes)
// /**Transaction Log API */
// router.use('/transaction-logs', transactionLogRoutes)

export const apiV2 = router