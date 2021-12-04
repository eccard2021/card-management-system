import mongoose from 'mongoose'
const TokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    require: true
  },
  token: {
    type: String,
    require: true
  },
  tokenType: {
    type: String,
    require: true,
    enum: ['login', 'withdraw', 'transfer'],
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