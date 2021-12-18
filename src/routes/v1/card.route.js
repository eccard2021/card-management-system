import express from 'express'
import { protect } from '../../middlewares/auth.middleware'
import * as CardController from '../../controllers/card.controller'

const router = express.Router()

router.use(protect)
router.route('/all-cards').get(CardController.getAllCardByUserId)
router.route('/deactive').put(CardController.deactiveCard)
router.route('/active').put(CardController.activeCard)

export const cardRoutes = router