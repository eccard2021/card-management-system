import express from 'express'
import * as PaymentController from '../../controllers/payment.controller'

const router = express.Router()

router.route('/domestic').post(PaymentController.domesticPayment)

export const paymentRoutes = router