import { body } from 'express-validator'

export const validatePaymentDomestic = () => {
  return [
    body('apiKey').notEmpty().withMessage('API key không hợp lệ'),
    body('cardNumber').notEmpty().withMessage('Số thẻ không hợp lệ'),
    body('PIN').notEmpty().withMessage('PIN không hợp lệ')
      .custom((value) => {
        if (value.length !== 6)
          throw new Error('PIN phải đủ 6 chữ số')
        return true
      }),
    body('expiredDate').notEmpty().withMessage('Ngày hết hạn không hợp lệ')
      .custom((value => {
        const enteredExDate = value.split('/')
        const month = Number(enteredExDate[0])
        const year = Number(enteredExDate[1])
        if (month < 1 || month > 12 || year > 3000 || year < 1950)
          throw new Error('Ngày hết hạn không hợp lệ')
        return true
      })),
    body('amount').isNumeric().withMessage('Số tiền không hợp lệ')
  ]
}

export const validatePaymentInternational = () => {
  return [
    body('apiKey').notEmpty().withMessage('API key không hợp lệ'),
    body('cardNumber').notEmpty().withMessage('Số thẻ không hợp lệ'),
    body('expiredDate').notEmpty().withMessage('Ngày hết hạn không hợp lệ')
      .custom((value => {
        const enteredExDate = value.split('/')
        const month = Number(enteredExDate[0])
        const year = Number(enteredExDate[1])
        if (month < 1 || month > 12 || year > 3000 || year < 1950)
          throw new Error('Ngày hết hạn không hợp lệ')
        return true
      })),
    body('amount').isNumeric().withMessage('Số tiền không hợp lệ'),
    body('currency').isISO4217().withMessage('Mã tiền tệ không hợp lệ')
  ]
}