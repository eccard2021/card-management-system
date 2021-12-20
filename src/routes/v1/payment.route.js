import express from 'express'
import * as PaymentController from '../../controllers/payment.controller'
import * as Validator from '../../validators/payment.validator'

const router = express.Router()

router.route('/domestic').post(Validator.validatePaymentDomestic(), PaymentController.domesticPayment)
router.route('/international').post(Validator.validatePaymentInternational(), PaymentController.internationalPayment)

export const paymentRoutes = router