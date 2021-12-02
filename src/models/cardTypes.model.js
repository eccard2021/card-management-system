import mongoose from 'mongoose'
import { standardizeCardNameForUrl } from '../utilities/cardType.utils'

const IntCreditsSchema = mongoose.Schema({
  cardUrl: {
    type: String,
    require: true,
    unique: true
  },
  isIssuing: {
    type: Boolean,
    required: true,
    default: true
  },
  publisher: {
    type: String,
    require: true
  },
  cardName: {
    type: String,
    require: true
  },
  image: {
    type: String,
    required: true
  },
  cardRank: { //standard, (silver), gold (dang tinh bo silver, giam tai)
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creditLine: { //han muc
    type: Number,
    required: true
  },
  condition: { //muc thu nhap de mo the, dieu kien mo the
    type: String,
    required: true
  },
  statmentDay: { //ngay sao ke
    type: Number,
    required: true
  },
  payWithin: { //ngay den han thanh toan, sau sao ke bao nhieu ngay
    type: Number,
    required: true
  },
  interestRate: { // % / thang, sau ngay den hang bat dau tinh
    type: Number,
    required: true
  },
  issueFee: {
    type: Number,
    required: true
  },
  yearlyFee: {
    type: Number,
    required: true
  },
  exCurrency: { //phi doi ngoai te (% tren thanh toan)
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  strict: true
})
const IntDebitsSchema = mongoose.Schema({
  cardUrl: {
    type: String,
    require: true,
    unique: true
  },
  isIssuing: {
    type: Boolean,
    required: true,
    default: true
  },
  publisher: {
    type: String,
    require: true
  },
  cardName: {
    type: String,
    require: true
  },
  image: {
    type: String,
    required: true
  },
  cardRank: { //standard, (silver), gold (dang tinh bo silver, giam tai)
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  maxPay: { //so tien duoc su dung toi da trong ngay
    type: Number,
    required: true
  },
  issueFee: {
    type: Number,
    required: true
  },
  yearlyFee: {
    type: Number,
    required: true
  },
  exCurrency: { //phi doi ngoai te (% tren thanh toan)
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  strict: true
})
const DomDebitsSchema = mongoose.Schema({
  cardUrl: {
    type: String,
    require: true,
    unique: true
  },
  isIssuing: {
    type: Boolean,
    required: true,
    default: true
  },
  publisher: {
    type: String,
    require: true
  },
  cardName: {
    type: String,
    require: true
  },
  image: {
    type: String,
    required: true
  },
  cardRank: { //standard, (silver), gold (dang tinh bo silver, giam tai)
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  issueFee: {
    type: Number,
    required: true
  },
  yearlyFee: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

IntCreditsSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    throw new Error('Tên thẻ bị trùng!!!')
  } else {
    next(error)
  }
})

const IntCredits = mongoose.model('IntCredits', IntCreditsSchema)
const IntDebits = mongoose.model('IntDebits', IntDebitsSchema)
const DomDebits = mongoose.model('DomDebits', DomDebitsSchema)


export { IntCredits, IntDebits, DomDebits }