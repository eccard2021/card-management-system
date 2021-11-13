import express from 'express'
import { authUser, getUserProfile, registerUser, updateUserProfile } from '@src/controllers/user.controller'
import { protect } from '@src/middlewares/auth.middleware.js'

const router = express.Router()

router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/').post(registerUser)

export const userRoutes = router