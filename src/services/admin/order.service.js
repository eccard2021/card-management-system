import { HttpStatusCode } from '../../utilities/constant'
import OrderForm from '../../models/orderForm.model'
import * as CardService from './card.service'
import mongoose from 'mongoose'
import User from '../../models/user.model'
import sendMail from '../../utilities/mailer'

export const getOrderPagination = async function (info) {
  const options = {
    page: info.page,
    limit: info.limit
  }
  const aggregate = OrderForm.aggregate([
    {
      '$lookup': {
        from: 'users',
        localField: 'orderOwner',
        foreignField: '_id',
        as: 'orderOwner'
      }
    },
    {
      '$unwind': '$orderOwner'
    },
    {
      '$project': {
        '_id': 1, 'orderType': 1, 'status': 1, 'accNumber': '$orderOwner.accNumber',
        'cusName': '$orderOwner.name', 'createdAt': 1
      }
    }
  ])
  const listOrder = await OrderForm.aggregatePaginate(aggregate, options)
  return {
    status: HttpStatusCode.OK,
    listOrder: listOrder
  }
}

export const getOrderById = async function (orderId) {
  const order = await OrderForm.aggregate([
    {
      '$match': { '_id': mongoose.Types.ObjectId(orderId) }
    },
    {
      '$lookup': {
        from: 'users',
        localField: 'orderOwner',
        foreignField: '_id',
        as: 'orderOwner'
      }
    },
    {
      '$unwind': '$orderOwner'
    },
    {
      '$project': {
        '_id': 1, 'orderType': 1, 'status': 1, 'createdAt': 1,
        'cusCmt': 1, 'bankCmt': 1,
        'orderOwner': {
          'name': 1, 'birth': 1, 'isMale': 1, 'personalIdNumber': 1,
          'phoneNumber': 1, 'email': 1, 'homeAddress': 1, 'job': 1,
          'accNumber': 1, '_id': 1
        }
      }
    }
  ])
  if (!order || order.length === 0)
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Không tìm thấy yêu cầu'
    }
  return {
    status: HttpStatusCode.OK,
    order: order[0]
  }
}

const cardInit = async function (approveInfo, order) {
  if (await CardService.checkUserHaveCardType(order))
    return {
      status: HttpStatusCode.OK,
      message: 'Người dùng đã sở hữu 1 trong những loại thẻ này'
    }
  const card = await CardService.registCardForUser(order)
  order.bankCmt = approveInfo.bankCmt
  order.status = 'approve'
  order.save()
  const user = await User.findById(order.orderOwner)
  sendMail(user.email, 'Thông tin thẻ', JSON.stringify(card))
  return {
    status: HttpStatusCode.OK,
    message: 'Tạo thẻ thành công, đã gửi thông tin thẻ vào email của người dùng'
  }
}

export const approveOrder = async function (approveInfo) {
  let order = await OrderForm.findById(approveInfo.orderId)
  if (!order)
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Không tim thấy yêu cầu'
    }
  if (order.status !== 'processing')
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: 'Yêu cầu này đã xử lí, không thể thao tác lại'
    }
  switch (order.orderType) {
    case 'CARD_Init': {
      return cardInit(approveInfo, order)
    }
    case 'CARD_Cancel': {
      break
    }
    case 'PaymentGate_Init': {
      break
    }
    case 'PaymentGate_Cancel': {
      break
    }
    case 'Re_PIN': {
      break
    }
    default: {
      break
    }
  }
}