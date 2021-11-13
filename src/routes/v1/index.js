import express from 'express'
import { HttpStatusCode } from '@src/utilities/constant'
import { userRoutes } from './user.route'

const router = express.Router()

/**
 * GET v1/status
 */

router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

/**User API */
router.use('/user', userRoutes)
export const apiV1 = router