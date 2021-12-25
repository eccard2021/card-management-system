import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const TransactionLogSchema = mongoose.Schema({
  from: {
    bank: {
      type: String,
      required: true
    },
    number: { //stk thuc hien
      type: String,
      required: true
    },
    remitterName: {
      type: String,
      required: true
    },
    UID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  transType: { //loai giao dich
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Services',
    required: true
  },
  to: {
    bank: {
      type: String,
      required: true
    },
    number: { //stk nhan
      type: String,
      required: true
    },
    receiverName: {
      type: String,
      required: true
    },
    UID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  fromCurrency: {
    transactionAmount: {
      type: Number,
      required: true,
      min: 0
    },
    transactionFee: {
      type: Number,
      required: true,
      min: 0
    },
    currency_code: {
      type: String,
      required: true
    }
  },
  toCurrency: {
    transactionAmount: {
      type: Number,
      required: true,
      min: 0
    },
    transactionFee: {
      type: Number,
      required: true,
      min: 0
    },
    currency_code: {
      type: String,
      required: true
    }
  },
  exchangeRate: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

TransactionLogSchema.plugin(aggregatePaginate)
const TransactionLog = mongoose.model('transactionlogs', TransactionLogSchema)

export default TransactionLog