import mongoose from 'mongoose'

const TransactionLogSchema = mongoose.Schema({
  fromNumber: { //stk thuc hien
    type: String,
    required: true
  },
  transType: { //loai giao dich
    type: String,
    required: true
  },
  toNumber: { //stk nhan
    type: String,
    required: true,
    default: null
  },
  amount: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const TransactionLog = mongoose.model('TransactionLog', TransactionLogSchema)

export default TransactionLog