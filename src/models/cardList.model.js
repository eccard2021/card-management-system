import mongoose from 'mongoose'

const cardListSchema = mongoose.Schema({
  cardNumber: {
    type: String,
    unique: true,
    required: true
  },
  publisher: {
    type: String,
    require: true
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
    default: null
  },
  expiredDate: {
    type: Date,
    default: null
  },
  cardTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'cardType'
  },
  cardType: {
    type: String,
    required: true,
    enum: ['IntCredits', 'IntDebits', 'DomDebits']
  }
}, {
  timestamps: true
})

const CardList = mongoose.model('cardList', cardListSchema)

export default CardList