import mongoose from 'mongoose'

const IntCreditSchema = mongoose.Schema({
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
  statmentDay: { //ngay sao ke
    type: String,
    required: true
  },
  payWithin: { //ngay den han thanh toan, sau sao ke bao nhieu ngay
    type: String,
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
  reIssueFee: { //phi cap lai the
    type: Number,
    required: true
  },
  rePINFee: { //phi cap lai pin
    type: Number,
    required: true
  },
  yearlyFee: {
    type: Number,
    required: true
  },
  inDrawFee: { //phi rut ngan hang trong nuoc
    type: Number,
    required: true
  },
  outDrawFee: { //phi rut ngan hang ngoai nuoc
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

const IntCredit = mongoose.model('IntCredit', IntCreditSchema)

export default IntCredit