import express from 'express'
import * as CardTypeController from '../../controllers/admin/cardManagement.controller'


const router = express.Router()

router.route('/:cardType')
  .post(CardTypeController.createCardType)
  .put()
//.delete()
/*router.route('/cards').get(getAllCardTypes)
router.route('/:cardType').get(getOneCardType)
router.route('/:cardType/:urlPath').get(getCardByTypeAndUrlPath)*/

export const cardTypeRoutes = router