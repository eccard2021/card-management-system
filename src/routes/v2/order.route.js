import express from 'express'
import * as OrderAdminController from '../../controllers/admin/order.controller'


const router = express.Router()

router.route('/all-order').get(OrderAdminController.getOrderPagination)
router.route('/order/details').get(OrderAdminController.getOrderById)
router.route('/order/approve').post(OrderAdminController.approveOrder)
router.route('/order/deny').post(OrderAdminController.denyOrder)

export const orderRoutes = router