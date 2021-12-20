import OrderForm from '../models/orderForm.model'
import CardList from '../models/cardList.model'
import PaymentGate from '../models/paymentGate.model'
import { IntCredits, IntDebits, DomDebits } from '../models/cardTypes.model'
import { HttpStatusCode } from '../utilities/constant'

const combination = {
  IntCredits: IntCredits,
  IntDebits: IntDebits,
  DomDebits: DomDebits
}

export const cardInit = async function (orderInfo) {

  if (!orderInfo.cardType || !orderInfo.cardTypeId || !combination[orderInfo.cardType])
    return { status: HttpStatusCode.NOT_FOUND, message: 'Thông tin không hợp lệ' }
  const cardType = await combination[orderInfo.cardType].findById(orderInfo.cardTypeId)
  if (!cardType)
    return { status: HttpStatusCode.NOT_FOUND, message: 'Thông tin không hợp lệ' }
  if (!cardType.isIssuing)
    return { status: HttpStatusCode.BAD_REQUEST, message: 'Hiện tại thẻ đang không phát hành' }
  let order = await OrderForm.create(orderInfo)
  await order.save()
  return {
    status: HttpStatusCode.OK,
    message: 'Yêu cầu mở thẻ của bạn đã tạo thành công. Chúng tôi sẽ xử lý yêu cầu của bạn trong thời gian sớm nhất'
  }
}

export const cardCancel = async function (orderInfo) {
  const card = await CardList.findOne({ _id: orderInfo.cardId, accOwner: orderInfo.orderOwner })
  if (!card) {
    return { status: HttpStatusCode.NOT_FOUND, message: 'Thông tin không hợp lệ' }
  }
  let order = await OrderForm.create(orderInfo)
  await order.save()
  return {
    status: HttpStatusCode.OK,
    message: 'Yêu cầu huỷ thẻ của bạn đã tạo thành công. Chúng tôi sẽ xử lý yêu cầu của bạn trong thời gian sớm nhất'
  }
}

export const paymentGatewayInit = async function (orderInfo) {
  if (orderInfo.globalGate == null)
    return { status: HttpStatusCode.NOT_FOUND, message: 'Thông tin không hợp lệ' }
  let order = await OrderForm.create(orderInfo)
  await order.save()
  return {
    status: HttpStatusCode.OK,
    message: 'Yêu cầu mở cổng thanh toán của bạn đã tạo thành công. Chúng tôi sẽ xử lý yêu cầu của bạn trong thời gian sớm nhất'
  }
}

export const paymentGatewayCancel = async function (orderInfo) {
  const gateway = await PaymentGate.findOne({ _id: orderInfo.gateId, gateOwner: orderInfo.orderOwner })
  if (!gateway)
    return { status: HttpStatusCode.NOT_FOUND, message: 'Thông tin không hợp lệ' }
  let order = await OrderForm.create(orderInfo)
  await order.save()
  return {
    status: HttpStatusCode.OK,
    message: 'Yêu cầu đóng cổng thanh toán của bạn đã tạo thành công. Chúng tôi sẽ xử lý yêu cầu của bạn trong thời gian sớm nhất'
  }
}

export const rePin = async function (orderInfo) {
  const card = await CardList.findOne({ _id: orderInfo.cardId, accOwner: orderInfo.orderOwner })
  if (!card) {
    return { status: HttpStatusCode.NOT_FOUND, message: 'Thông tin không hợp lệ' }
  }
  let order = await OrderForm.create(orderInfo)
  await order.save()
  return {
    status: HttpStatusCode.OK,
    message: 'Yêu cầu cấp lại mã PIN của bạn đã tạo thành công. Chúng tôi sẽ xử lý yêu cầu của bạn trong thời gian sớm nhất'
  }
}