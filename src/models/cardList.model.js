import mongoose from 'mongoose'

const cardListSchema = mongoose.Schema({
  cardNumber: {
    type: String,
    unique: true,
    required: true
  },
  CVV: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false
  },
  accOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    default: null
  },
  validDate: {
    type: Date,
    require: true
  },
  expiredDate: {
    type: Date,
    required: true
  },
  cardTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'cardType'
  },
  cardType: { //Xác định là GC, GD hay LD
    type: String,
    required: true,
    enum: ['intcredits', 'intdebits', 'domdebits']
  }
}, {
  timestamps: true
})

const cardList = mongoose.model('cardList', cardListSchema)

export default cardList