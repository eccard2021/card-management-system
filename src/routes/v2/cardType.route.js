import express from 'express'
import * as CardTypeController from '../../controllers/admin/cardManagement.controller'


const router = express.Router()

router.route('/:cardType')
  .get(CardTypeController.getListCardsByType)
  .post(CardTypeController.createCardType)
  .put(CardTypeController.updateCardType)
router.route('/:cardType/:urlPath')
  .get(CardTypeController.getCardByTypeAndUrlPath)
//.delete()
router.route('/:cardType/new')
  .post(CardTypeController.createCard)

export const cardTypeRoutes = router