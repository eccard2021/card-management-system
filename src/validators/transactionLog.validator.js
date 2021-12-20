import { query } from 'express-validator'

export const validateLogId = () => {
  return [
    query('_id').notEmpty().withMessage('_id không hợp lệ')
  ]
}