import express from 'express'
import { authUser, getUserProfile, registerUser, updateUserProfile, logOutUser, logOutAll } from '@src/controllers/user.controller'
import { protect } from '@src/middlewares/auth.middleware'
import { validateRegisterUser, validateLoginUser, validateModifyPasswordUser } from '@src/validators/user.validator'

const router = express.Router()

router.post('/login', validateLoginUser(), authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, validateModifyPasswordUser(), updateUserProfile)
router.route('/register').post(validateRegisterUser(), registerUser)
router.route('/logout').post(protect, logOutUser)
router.route('/logoutall').post(protect, logOutAll)

export const userRoutes = router