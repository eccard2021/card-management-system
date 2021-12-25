import mongoose from 'mongoose'
const TokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  tokenType: {
    type: String,
    required: true,
    enum: ['login', 'charge', 'withdraw', 'transfer', 'forgot-password', 'debt-payment'],
    default: 'login'
  },
  expireAt: {
    type: Date,
    expires: '1d',
    default: Date.now
  }
}, {
  timestamps: true
})

const Token = mongoose.model('tokens', TokenSchema)

export default Token