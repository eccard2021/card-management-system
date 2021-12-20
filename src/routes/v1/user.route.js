import express from 'express'
import {
  authUser, getUserProfile, registerUser,
  updateUserPassword, logOutUser, logOutAll, chargeUser, chargeSubmitUser,
  withdrawMoneyUser, withdrawMoneySubmitUser, forgotPassword, getForgotPasswordInfoUser,
  forgotPasswordSubmit, getWithdrawMoneyInfoUser, transferMoneyUser, getTransferMoneyInfoUser, transferMoneySubmitUser,
  creditDebtPayment, getDebtPaymentUser, creditDebtPaymentSubmitUser
} from '../../controllers/user.controller'
import { protect, authForgotPassword } from '../../middlewares/auth.middleware'
import { authWithdrawMoney, authTransferMoney, authDebtPayment, authChargeMoney } from '../../middlewares/authTransactions.middleware'
import {
  validateRegisterUser, validateLoginUser, validateModifyPasswordUser,
  validateChargeUser, validateWithdrawMoneyUser, validateTransferMoneyUser,
  validateDebtPaymentUser
} from '../../validators/user.validator'

const router = express.Router()

router.post('/login', validateLoginUser(), authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, validateModifyPasswordUser(), updateUserPassword)
router.route('/register').post(validateRegisterUser(), registerUser)
router.route('/logout').post(protect, logOutUser)
router.route('/logoutall').post(protect, logOutAll)
router.route('/charge').post(protect, validateChargeUser(), chargeUser)
router.route('/charge/submit').post(protect, authChargeMoney, chargeSubmitUser)
router.route('/withdraw-money').post(protect, validateWithdrawMoneyUser(), withdrawMoneyUser)
router.route('/withdraw-money/verify').post(protect, authWithdrawMoney, getWithdrawMoneyInfoUser)
router.route('/withdraw-money/submit').post(protect, authWithdrawMoney, withdrawMoneySubmitUser)
router.route('/forgot-password').post(forgotPassword)
router.route('/forgot-password/verify').post(authForgotPassword, getForgotPasswordInfoUser)
router.route('/forgot-password/submit').post(authForgotPassword, validateModifyPasswordUser(), forgotPasswordSubmit)
router.route('/transfer').post(protect, validateTransferMoneyUser(), transferMoneyUser)
router.route('/transfer/verify').post(protect, authTransferMoney, getTransferMoneyInfoUser)
router.route('/transfer/submit').post(protect, authTransferMoney, transferMoneySubmitUser)
router.route('/debt-payment').post(protect, validateDebtPaymentUser(), creditDebtPayment)
router.route('/debt-payment/verify').post(protect, authDebtPayment, getDebtPaymentUser)
router.route('/debt-payment/submit').post(protect, authDebtPayment, creditDebtPaymentSubmitUser)
export const userRoutes = router