import express from 'express'
import { adminRoutes } from './admin.route'
import { userManagementRoutes } from './userManagement.route'
import { HttpStatusCode } from '../../utilities/constant'
import { authAdmin } from '../../middlewares/authAdmin.middleware'
const router = express.Router()

/**
 * GET v2/status
 */

router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))


router.use(authAdmin)
/**Admin API */
router.use('/admin', adminRoutes)
/**User Management API */
router.use('/users', userManagementRoutes)
// /**CardType API */
// router.use('/card-type', cardTypeRoutes)
// /**Transaction Log API */
// router.use('/transaction-logs', transactionLogRoutes)

export const apiV2 = router