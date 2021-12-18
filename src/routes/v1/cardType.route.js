import express from 'express'
import { getCardByTypeAndUrlPath, getOneCardType, getAllCardTypes } from '../../controllers/cardType.controller'

const router = express.Router()

router.route('/cards').get(getAllCardTypes)
router.route('/:cardType').get(getOneCardType)
router.route('/:cardType/:urlPath').get(getCardByTypeAndUrlPath)

export const cardTypeRoutes = router