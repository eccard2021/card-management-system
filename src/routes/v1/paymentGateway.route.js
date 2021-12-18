import express from 'express'
import { protect } from '../../middlewares/auth.middleware'
import * as PaymentGatewayController from '../../controllers/paymentGateway.controller'


const router = express.Router()

router.use(protect)
router.route('/all-gateways').get(PaymentGatewayController.getAllPaymentGatewayByUserID)

export const paymentGatewayRoutes = router