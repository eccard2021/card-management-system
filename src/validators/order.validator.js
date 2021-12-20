import { body } from 'express-validator'

export const validateOrder = () => {
  return [
    body('cardTypeId').notEmpty(),
    body('cardType').notEmpty()
  ]
}