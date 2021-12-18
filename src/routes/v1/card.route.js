import express from 'express'
import { protect } from '../../middlewares/auth.middleware'
import * as CardController from '../../controllers/card.controller'

const router = express.Router()

router.use(protect)
router.route('/all-cards').get(CardController.getAllCardByUserId)

export const cardRoutes = router