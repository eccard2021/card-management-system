import express from 'express'
import { createCardType, getOneCardType, getAllCardTypes, updateCardType, deleteCardType } from '@src/controllers/card.controller'
import { protect } from '@src/middlewares/auth.middleware'

const router = express.Router()

router.post('/create-card-type', protect, createCardType)
router.route('/card/:_id').get(getOneCardType)
router.get('/cards', getAllCardTypes)
router.route('/update-card').put(protect, updateCardType)
router.route('/delete-card').delete(protect, deleteCardType)

export const cardTypeRoutes = router