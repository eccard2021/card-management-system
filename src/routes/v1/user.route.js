import express from 'express'
import {
  authUser, getUserProfile, registerUser,
  updateUserPassword, logOutUser, logOutAll, chargeUser, chargeSubmitUser,
  withdrawMoneyUser, withdrawMoneySubmitUser, forgotPassword, getWithdrawMoneyInfoUser,
  transferMoneyUser, getTransferMoneyInfoUser, transferMoneySubmitUser
} from '../../controllers/user.controller'
import { protect } from '../../middlewares/auth.middleware'
import { authWithdrawMoney, authTransferMoney } from '../../middlewares/authTransactions.middleware'
import { validateRegisterUser, validateLoginUser, validateModifyPasswordUser } from '../../validators/user.validator'

const router = express.Router()

router.post('/login', validateLoginUser(), authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, validateModifyPasswordUser(), updateUserPassword)
router.route('/register').post(validateRegisterUser(), registerUser)
router.route('/logout').post(protect, logOutUser)
router.route('/logoutall').post(protect, logOutAll)
router.route('/charge').post(protect, chargeUser)
router.route('/charge/submit').post(protect, chargeSubmitUser)
router.route('/withdraw-money').post(protect, withdrawMoneyUser)
router.route('/withdraw-money/verify').post(protect, authWithdrawMoney, getWithdrawMoneyInfoUser)
router.route('/withdraw-money/submit').post(protect, authWithdrawMoney, withdrawMoneySubmitUser)
router.route('/forgot-password').post(forgotPassword)
router.route('/transfer').post(protect, transferMoneyUser)
router.route('/transfer/verify').post(protect, authTransferMoney, getTransferMoneyInfoUser)
router.route('/transfer/submit').post(protect, authTransferMoney, transferMoneySubmitUser)
export const userRoutes = router