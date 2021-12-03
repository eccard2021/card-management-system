import mongoose from 'mongoose'

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
      require: true
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
      require: true
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
      require: true,
      min: 0
    },
    currency_code: {
      type: String,
      require: true
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
      require: true,
      min: 0
    },
    currency_code: {
      type: String,
      require: true
    }
  },
  exchangeRate: {
    type: Number,
    require: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const TransactionLog = mongoose.model('transactionlogs', TransactionLogSchema)

export default TransactionLog