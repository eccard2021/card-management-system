import express from 'express'
import { protect } from '../../middlewares/auth.middleware'
import * as OrderController from '../../controllers/order.constroller'
import * as Validator from '../../validators/order.validator'

const router = express.Router()

router.route('/card-init').post(protect, Validator.validateOrder(), OrderController.cardInitOrder)
router.route('/card-cancel').post(protect, OrderController.cardCancelOrder)
router.route('/paymentgateway-init').post(protect, OrderController.paymentGatewayInitOrder)
router.route('/paymentgateway-cancel').post(protect, OrderController.paymentGatewayCancelOrder)
router.route('/re-pin').post(protect, OrderController.rePinOrder)
export const orderRoutes = router