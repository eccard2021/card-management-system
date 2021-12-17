import { HttpStatusCode } from '../../utilities/constant'
import OrderForm from '../../models/orderForm.model'
import * as CardService from './card.service'
import * as PaymentGatewayService from './paymentGateway.service'
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
    },
    { '$sort': { 'createdAt': -1 } }
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
  if (order.length === 0)
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

const cardCancel = async function (approveInfo, order) {
  if (!(await CardService.checkUserOwnCard(order)))
    return {
      status: HttpStatusCode.OK,
      message: 'Người dùng không sở hữu thẻ này'
    }
  const card = await CardService.cancelCard(order)
  order.bankCmt = approveInfo.bankCmt
  order.status = 'approve'
  order.save()
  const user = await User.findById(order.orderOwner)
  sendMail(user.email, 'Thông báo huỷ thẻ', JSON.stringify(card))
  return {
    status: HttpStatusCode.OK,
    message: 'Huỷ thẻ thành công'
  }
}

const paymentGatewayInit = async function (approveInfo, order) {
  if (await PaymentGatewayService.checkUserHavePaymentGateway(order))
    return {
      status: HttpStatusCode.OK,
      message: 'Người dùng đã có cổng thanh toán loại này'
    }
  const gateway = await PaymentGatewayService.registPaymentGateway(order)
  order.bankCmt = approveInfo.bankCmt
  order.status = 'approve'
  order.save()
  const user = await User.findById(order.orderOwner)
  sendMail(user.email, 'Thông tin cổng thanh toán', JSON.stringify(gateway))
  return {
    status: HttpStatusCode.OK,
    message: 'Tạo cổng thanh toán thành công, đã gửi thông tin thẻ vào email của người dùng'
  }
}

const paymentGatewayCancel = async function (approveInfo, order) {
  if (await PaymentGatewayService.checkUserOwnPaymentGateway(order))
    return {
      status: HttpStatusCode.OK,
      message: 'Người dùng không sở hữu cổng thanh toán này'
    }
  const gateway = await PaymentGatewayService.cancelPaymentGateway(order)
  order.bankCmt = approveInfo.bankCmt
  order.status = 'approve'
  order.save()
  const user = await User.findById(order.orderOwner)
  sendMail(user.email, 'Xoá cổng thanh toán', JSON.stringify(gateway))
  return {
    status: HttpStatusCode.OK,
    message: 'Tạo cổng thanh toán thành công, đã gửi thông tin thẻ vào email của người dùng'
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
      return cardCancel(approveInfo, order)
    }
    case 'PaymentGate_Init': {
      return paymentGatewayInit(approveInfo, order)
    }
    case 'PaymentGate_Cancel': {
      return paymentGatewayCancel(approveInfo, order)
    }
    case 'Re_PIN': {
      break
    }
    default: {
      break
    }
  }
}

export const denyOrder = async function (denyInfo) {
  let order = await OrderForm.findById(denyInfo.orderId)
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
  order.bankCmt = denyInfo.bankCmt
  order.status = 'deny'
  order.save()
  const user = await User.findById(order.orderOwner)
  sendMail(user.email, 'LTSBANK: Từ chối yêu cầu', JSON.stringify(order))
  return {
    status: HttpStatusCode.OK,
    message: 'Đã từ chối yêu cầu'
  }
}
