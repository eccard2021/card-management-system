import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'
import * as OrderService from '../services/order.service'
import { validationResult } from 'express-validator'

export const cardInitOrder = asyncHandler(async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ message: 'Thông tin còn sót hoặc không hợp lệ' })
    return
  }
  const orderInfo = {
    orderType: 'CARD_Init',
    orderOwner: req.user._id,
    cusCmt: req.body.cusCmt,
    bankCmt: req.body.bankCmt,
    cardTypeId: req.body.cardTypeId,
    cardType: req.body.cardType
  }
  try {
    const result = await OrderService.cardInit(orderInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})

export const cardCancelOrder = asyncHandler(async function (req, res) {
  const orderInfo = {
    orderType: 'CARD_Cancel',
    orderOwner: req.user._id,
    cusCmt: req.body.cusCmt,
    bankCmt: req.body.bankCmt,
    cardId: req.body.cardId
  }
  try {
    const result = await OrderService.cardCancel(orderInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})

export const paymentGatewayInitOrder = asyncHandler(async function (req, res) {
  const orderInfo = {
    orderType: 'PaymentGate_Init',
    orderOwner: req.user._id,
    cusCmt: req.body.cusCmt,
    bankCmt: req.body.bankCmt,
    globalGate: req.body.globalGate
  }
  try {
    const result = await OrderService.paymentGatewayInit(orderInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})

export const paymentGatewayCancelOrder = asyncHandler(async function (req, res) {
  const orderInfo = {
    orderType: 'PaymentGate_Cancel',
    orderOwner: req.user._id,
    cusCmt: req.body.cusCmt,
    bankCmt: req.body.bankCmt,
    gateId: req.body.gateId
  }
  try {
    const result = await OrderService.paymentGatewayCancel(orderInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})

export const rePinOrder = asyncHandler(async function (req, res) {
  const orderInfo = {
    orderType: 'Re_PIN',
    orderOwner: req.user._id,
    cusCmt: req.body.cusCmt,
    bankCmt: req.body.bankCmt,
    cardId: req.body.cardId
  }
  try {
    const result = await OrderService.cardCancel(orderInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})
