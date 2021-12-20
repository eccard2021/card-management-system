import { body } from 'express-validator'

export const validateRegisterUser = () => {
  return [
    body('name')
      .matches(/^[a-zA-Z ]+$/).withMessage('Tên chỉ được chứa kí tự Alphabet')
      .notEmpty().withMessage('Tên không được để trống'),
    body('birth', 'Ngày sinh không hợp lệ').isISO8601('yyyy-mm-dd'),
    body('isMale', 'Giới tính không hợp lệ').isBoolean(),
    body('personalIdNumber.number')
      .isNumeric().withMessage('Số CMND/CCCD không hợp lệ')
      .custom((value) => {
        if (value.length != 9 && value.length != 12) {
          throw new Error('Số CMND/CCCD không hợp lệ')
        }
        return true
      }),
    body('personalIdNumber.issueDate').isISO8601('yyyy-mm-dd').withMessage('Ngày cấp CMND/CCCD không hợp lệ'),
    body('personalIdNumber.issuePlace').notEmpty().withMessage('Nơi cấp CMND/CCCD không hợp lệ'),
    body('phoneNumber').isMobilePhone(['vi-VN']).withMessage('Số điện thoại không hợp lệ'),
    body('email', 'Email không hợp lệ').isEmail().notEmpty(),
    body('homeAddress').notEmpty().withMessage('Địa chỉ nhà không được để trống'),
    body('job.title').notEmpty().withMessage('Nghề nghiệp không được để trống'),
    body('job.workAddress').notEmpty().withMessage('Nơi làm việc không được để trống')
    //body('job.salary')
  ]
}
export const validateLoginUser = () => {
  return [
    body('email').isEmail().withMessage('Email không hợp lệ')
  ]
}

export const validateModifyPasswordUser = () => {
  return [
    body('newPassword')
      .isLength({ min: 8 }).withMessage('Mật khẩu phải từ 8 kí tự trở lên')
      .matches(/\d/).withMessage('Mật khẩu phải chứa ít nhất 1 kí tự số')
      .matches(/[a-z]/).withMessage('Mật khẩu phải chứa ít nhất 1 kí tự thường')
      .matches(/[A-Z]/).withMessage('Mật khẩu phải chứa ít nhất 1 kí tự in hoa')
      .matches(/[!@#$%^&*]/).withMessage('Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt'),
    body('confirmNewPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Mật khẩu xác nhận không khớp')
      }
      return true
    })
  ]

}

export const validateChargeUser = () => {
  return [
    body('amount').isNumeric().withMessage('Số tiền không hợp lệ')
  ]
}

export const validateWithdrawMoneyUser = () => {
  return [
    body('amount').isNumeric().withMessage('Số tiền không hợp lệ')
  ]
}

export const validateTransferMoneyUser = () => {
  return [
    body('amount').isNumeric().withMessage('Số tiền không hợp lệ')
  ]
}

export const validateDebtPaymentUser = () => {
  return [
    body('amount').isNumeric().withMessage('Số tiền không hợp lệ')
  ]
}