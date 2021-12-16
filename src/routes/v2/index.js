import express from 'express'
import { adminRoutes } from './admin.route'
import { userManagementRoutes } from './userManagement.route'
import { cardTypeRoutes } from './cardType.route'
import { HttpStatusCode } from '../../utilities/constant'
import { authAdmin } from '../../middlewares/authAdmin.middleware'
import { orderRoutes } from './order.route'
const router = express.Router()

/**
 * GET v2/status
 */

router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

/**Admin API */
router.use('/admin', adminRoutes)
router.use(authAdmin)
/**User Management API */
router.use('/users', userManagementRoutes)
// /**CardType API */
router.use('/card-type', cardTypeRoutes)
// /**Transaction Log API */
// router.use('/transaction-logs', transactionLogRoutes)
/**Order API */
router.use('/orders', orderRoutes)

export const apiV2 = router