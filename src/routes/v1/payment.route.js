import express from 'express'
import * as PaymentController from '../../controllers/payment.controller'

const router = express.Router()

router.route('/domestic').post(PaymentController.domesticPayment)
router.route('/international').post(PaymentController.internationalPayment)

export const paymentRoutes = router