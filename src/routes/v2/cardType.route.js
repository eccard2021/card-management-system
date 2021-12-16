import express from 'express'
import * as CardTypeController from '../../controllers/admin/cardManagement.controller'


const router = express.Router()

router.route('/:cardType')
  .get(CardTypeController.getListCardsByType)
  .post(CardTypeController.createCardType)
router.route('/:cardType/:urlPath')
  .get(CardTypeController.getCardByTypeAndUrlPath)
  .put(CardTypeController.updateCardType)
//.delete()

export const cardTypeRoutes = router