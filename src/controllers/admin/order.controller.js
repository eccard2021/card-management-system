import asyncHandler from 'express-async-handler'
import * as OrderService from '../../services/admin/order.service'
import { HttpStatusCode } from '../../utilities/constant'

export const getOrderPagination = asyncHandler(async function (req, res) {
  const info = {
    page: req.query.page || 1,
    limit: 10,
    adminId: req.admin._id
  }
  try {
    const result = await OrderService.getOrderPagination(info)
    res.status(result.status).json(result.listOrder)
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})

export const getOrderById = asyncHandler(async function (req, res) {
  const orderId = req.query.orderId
  try {
    const result = await OrderService.getOrderById(orderId)
    res.status(result.status).json(result.order)
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})

export const approveOrder = asyncHandler(async function (req, res) {
  const approveInfo = {
    bankCmt: req.body.bankCmt,
    orderId: req.body.orderId
  }
  try {
    const result = await OrderService.approveOrder(approveInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})

export const denyOrder = asyncHandler(async function (req, res) {
  const denyInfo = {
    bankCmt: req.body.bankCmt,
    orderId: req.body.orderId
  }
  try {
    const result = await OrderService.denyOrder(denyInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})