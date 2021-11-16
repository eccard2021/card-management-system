import mongoose from 'mongoose'

const CardTypeSchema = mongoose.Schema({
  intCredits: [{
    type: mongoose.Schema({
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
  }],
  intDebits: [{
    type: mongoose.Schema({
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
      maxDraw: { //so tien duoc rut toi da trong ngay
        type: Number,
        required: true
      },
      maxDrawTime: { //so lan rut toi da trong ngay
        type: Number,
        required: true
      },
      maxTransfer: {
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
      outDrawFee: { //phi rut ngan hang ngoai nuoc (tinh % / giao dich)
        type: Number,
        required: true
      },
      transferFee: {
        type: Number,
        required: true
      }
    }, {
      timestamps: true
    })
  }],
  domDebits: [{
    type: mongoose.Schema({
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
      maxDraw: {
        type: Number,
        required: true
      },
      maxDrawTime: {
        type: Number,
        required: true
      },
      maxTransfer: {
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
      inDrawFee: { //phi rut cung ngan hang
        type: Number,
        required: true
      },
      outDrawFee: { //phi rut khac ngan hang
        type: Number,
        required: true
      },
      transferFee: {
        type: Number,
        required: true
      }
    }, {
      timestamps: true
    })
  }]
}, {
  timestamps: true
})

const CardType = mongoose.model('CardType', CardTypeSchema)

export default CardType