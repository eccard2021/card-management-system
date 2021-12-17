import bcrypt from 'bcryptjs'
import { SERVICE_ACTION_TYPE } from '../utilities/constant'

export const users = [
  {
    name: 'LoDo',
    birth: Date.now(),
    isMale: true,
    personalIdNumber: {
      number: '123456789',
      issueDate: Date.now(),
      issuePlace: 'ĐN'
    },
    phoneNumber: '0987654321',
    email: 'ng.baotran.2k1@gmail.com',
    homeAddress: 'ĐN',
    job: {
      title: 'Sinh vien',
      workAddress: 'HCMUTE',
      salary: 32000
    },
    accNumber: '123456',
    password: '123456',
    isAdmin: true,
    isActive: true,
    balance: 100000000
  },
  {
    name: 'TranNguyen',
    birth: Date.now(),
    isMale: true,
    personalIdNumber: {
      number: '987654321',
      issueDate: Date.now(),
      issuePlace: 'ĐN'
    },
    phoneNumber: '0987654321',
    email: 'tran4774@gmail.com',
    homeAddress: 'ĐN',
    job: {
      title: 'Sinh vien',
      workAddress: 'HCMUTE',
      salary: 32000
    },
    accNumber: '654321',
    password: '123456',
    isAdmin: false,
    isActive: true,
    balance: 100000000
  }
]

export const intCredits = [
  {
    cardUrl: 'the-tin-dung-quoc-te-lts-visa-standard',
    cardName: 'Thẻ Tín dụng Quốc Tế LTS VISA Standard',
    isIssuing: true,
    publisher: 'VISA',
    image: 'https://firebasestorage.googleapis.com/v0/b/cardec-30bbb.appspot.com/o/CardTypes%2FintCredits%2Fthe-lts-internaional-credit-visa-standard.png?alt=media',
    cardRank: 'Standard',
    description: 'Thẻ tín dụng VISA standard, cho thép thanh toán trực tuyến trên các website có biểu tượng của LTS Bank trên toàn cầu, Chi tiêu trước - trả tiền sau - Thời gian miễn lãi tối đa 45 ngày.',
    creditLine: 50000000,
    condition: 8000000,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 0.023,
    issueFee: 150000,
    yearlyFee: 70000,
    exCurrency: 0.01
  },
  {
    cardUrl: 'the-tin-dung-quoc-te-lts-visa-gold',
    cardName: 'Thẻ Tín dụng Quốc Tế LTS VISA Gold',
    isIssuing: true,
    publisher: 'VISA',
    image: 'https://firebasestorage.googleapis.com/v0/b/cardec-30bbb.appspot.com/o/CardTypes%2FintCredits%2Fthe-lts-internaional-credit-visa-gold.png?alt=media',
    cardRank: 'Gold',
    description: 'Thẻ tín dụng VISA Gold, cho thép thanh toán trực tuyến trên các website có biểu tượng của LTS Bank trên toàn cầu, Chi tiêu trước - trả tiền sau - Thời gian miễn lãi tối đa 45 ngày.',
    creditLine: 250000000,
    condition: 40000000,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 0.023,
    issueFee: 300000,
    yearlyFee: 200000,
    exCurrency: 0.01
  },
  {
    cardUrl: 'the-tin-dung-quoc-te-lts-mastercard-standard',
    cardName: 'Thẻ Tín dụng Quốc Tế LTS Mastercard Standard',
    isIssuing: true,
    publisher: 'MasterCard',
    image: 'https://firebasestorage.googleapis.com/v0/b/cardec-30bbb.appspot.com/o/CardTypes%2FintCredits%2Fthe-lts-internaional-credit-mastercard-standard.png?alt=media',
    cardRank: 'Standard',
    description: 'Thẻ tín dụng MasterCard Standard, cho thép thanh toán trực tuyến trên các website có biểu tượng của LTS Bank trên toàn cầu, Chi tiêu trước - trả tiền sau - Thời gian miễn lãi tối đa 45 ngày.',
    creditLine: 70000000,
    condition: 15000000,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 0.025,
    issueFee: 200000,
    yearlyFee: 140000,
    exCurrency: 0.008
  },
  {
    cardUrl: 'the-tin-dung-quoc-te-lts-mastercard-gold',
    cardName: 'Thẻ Tín dụng Quốc Tế LTS Mastercard Gold',
    isIssuing: true,
    publisher: 'MasterCard',
    image: 'https://firebasestorage.googleapis.com/v0/b/cardec-30bbb.appspot.com/o/CardTypes%2FintCredits%2Fthe-lts-internaional-credit-mastercard-gold.png?alt=media',
    cardRank: 'Gold',
    description: 'Thẻ tín dụng MasterCard Gold, cho thép thanh toán trực tuyến trên các website có biểu tượng của LTS Bank trên toàn cầu, Chi tiêu trước - trả tiền sau - Thời gian miễn lãi tối đa 45 ngày.',
    creditLine: 350000000,
    condition: 65000000,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 0.024,
    issueFee: 400000,
    yearlyFee: 300000,
    exCurrency: 0.008
  }

]

export const intDebits = [
  {
    cardUrl: 'the-ghi-no-quoc-te-lts-mastercard-standard',
    cardName: 'Thẻ Ghi nợ Quốc Tế LTS Mastercard Standard',
    isIssuing: true,
    publisher: 'MasterCard',
    image: 'https://firebasestorage.googleapis.com/v0/b/cardec-30bbb.appspot.com/o/CardTypes%2FintDebits%2Fthe-lts-internaional-Debit-mastercard-standard.png?alt=media',
    cardRank: 'Standard',
    description: 'Thẻ ghi nợ quốc tế MasterCard Standard, cho thép thanh toán trực tuyến trên các website có biểu tượng của LTS Bank trên toàn cầu.',
    maxPay: 400000000,
    issueFee: 0,
    yearlyFee: 100000,
    exCurrency: 0.008
  },
  {
    cardUrl: 'the-ghi-no-quoc-te-lts-mastercard-gold',
    cardName: 'Thẻ Ghi nợ Quốc Tế LTS Mastercard Gold',
    isIssuing: true,
    publisher: 'MasterCard',
    image: 'https://firebasestorage.googleapis.com/v0/b/cardec-30bbb.appspot.com/o/CardTypes%2FintDebits%2Fthe-lts-internaional-Debit-mastercard-gold.png?alt=media',
    cardRank: 'Gold',
    description: 'Thẻ ghi nợ quốc tế MasterCard Gold, cho thép thanh toán trực tuyến trên các website có biểu tượng của LTS Bank trên toàn cầu.',
    maxPay: 800000000,
    issueFee: 50000,
    yearlyFee: 200000,
    exCurrency: 0.008
  },
  {
    cardUrl: 'the-ghi-no-quoc-te-lts-visa-standard',
    cardName: 'Thẻ Ghi nợ Quốc Tế LTS VISA Standard',
    isIssuing: true,
    publisher: 'VISA',
    image: 'https://firebasestorage.googleapis.com/v0/b/cardec-30bbb.appspot.com/o/CardTypes%2FintDebits%2Fthe-lts-internaional-Debit-visa-standard.png?alt=media',
    cardRank: 'Standard',
    description: 'Thẻ ghi nợ quốc tế VISA Standard, cho thép thanh toán trực tuyến trên các website có biểu tượng của LTS Bank trên toàn cầu.',
    maxPay: 500000000,
    issueFee: 0,
    yearlyFee: 80000,
    exCurrency: 0.0075
  },
  {
    cardUrl: 'the-ghi-no-quoc-te-lts-visa-gold',
    cardName: 'Thẻ Ghi nợ Quốc Tế LTS VISA Gold',
    isIssuing: true,
    publisher: 'VISA',
    image: 'https://firebasestorage.googleapis.com/v0/b/cardec-30bbb.appspot.com/o/CardTypes%2FintDebits%2Fthe-lts-internaional-Debit-visa-gold.png?alt=media',
    cardRank: 'Gold',
    description: 'Thẻ ghi nợ quốc tế VISA Gold, cho thép thanh toán trực tuyến trên các website có biểu tượng của LTS Bank trên toàn cầu.',
    maxPay: 700000000,
    issueFee: 0,
    yearlyFee: 100000,
    exCurrency: 0.0075
  }
]

export const domDebits = [
  {
    cardUrl: 'the-ghi-no-noi-dia-lts-Napas-standard',
    cardName: 'Thẻ Ghi nợ Nội địa LTS Napas Standard',
    isIssuing: true,
    publisher: 'Napas',
    image: 'https://firebasestorage.googleapis.com/v0/b/cardec-30bbb.appspot.com/o/CardTypes%2FdomDebits%2Fthe-lts-domestic-Debit-Napas-standard.png?alt=media',
    cardRank: 'Standard',
    description: 'Thẻ ghi nợ nội địa Napas Standard, cho thép thanh toán trực tuyến trên các website có biểu tượng của LTS Bank trong nội địa Quốc Gia',
    maxPay: 100000000,
    issueFee: 0,
    yearlyFee: 45000
  }
]

export const services = [
  {
    service_name: 'NAP TIEN PAYPAL',
    fixedfee: 0.6,
    fee_rate: 0.035,
    coefficient: 1,
    action: SERVICE_ACTION_TYPE.CHARGE
  },
  {
    service_name: 'RUT TIEN PAYPAL',
    fixedfee: 0,
    fee_rate: 0,
    coefficient: -1,
    action: SERVICE_ACTION_TYPE.WITHDRAW
  },
  {
    service_name: 'CHUYEN TIEN TRONG NGAN HANG',
    fixedfee: 0,
    fee_rate: 0.003,
    coefficient: -1,
    action: SERVICE_ACTION_TYPE.TRANSFER
  },
  {
    service_name: 'THANH TOAN ONLINE',
    fixedfee: 0,
    fee_rate: 0.035,
    coefficient: -1,
    action: SERVICE_ACTION_TYPE.PAYMENT
  },
  {
    service_name: 'PHI DUY TRI TAI KHOAN',
    fixedfee: 0.49,
    fee_rate: 0.0349,
    coefficient: -1,
    action: SERVICE_ACTION_TYPE.MONTHLY_FEE
  }
]

export const cardList = [
  /////////////////////////////INT Credit/////////////////////////////////////
  //////////VISA
  {
    cardNumber: '4000020000000000',
    publisher: 'VISA',
    CVV: '828',
    PIN: '123456',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f62f',
    cardType: 'IntCredits',
    currentUsed: 0
  },
  {
    cardNumber: '4484600000000004',
    publisher: 'VISA',
    CVV: '737',
    PIN: '159753',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f62f',
    cardType: 'IntCredits',
    currentUsed: 0
  },
  {
    cardNumber: '4000640000000005',
    publisher: 'VISA',
    CVV: '697',
    PIN: '145365',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f630',
    cardType: 'IntCredits',
    currentUsed: 0
  },
  {
    cardNumber: '4003550000000003',
    publisher: 'VISA',
    CVV: '831',
    PIN: '456852',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f630',
    cardType: 'IntCredits',
    currentUsed: 0
  },
  /////////MASTERCARD
  {
    cardNumber: '2223000048410010',
    publisher: 'MasterCard',
    CVV: '182',
    PIN: '789456',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f631',
    cardType: 'IntCredits',
    currentUsed: 0
  },
  {
    cardNumber: '2222400010000008',
    publisher: 'MasterCard',
    CVV: '141',
    PIN: '654789',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f631',
    cardType: 'IntCredits',
    currentUsed: 0
  },
  {
    cardNumber: '5100060000000002',
    publisher: 'MasterCard',
    CVV: '697',
    PIN: '985654',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f632',
    cardType: 'IntCredits',
    currentUsed: 0
  },
  {
    cardNumber: '2222400030000004',
    publisher: 'MasterCard',
    CVV: '831',
    PIN: '152365',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f632',
    cardType: 'IntCredits',
    currentUsed: 0
  },
  /////////////////////////INT Debit/////////////////////////////
  //////////////////VISA
  {
    cardNumber: '4000160000000004',
    publisher: 'VISA',
    CVV: '828',
    PIN: '110511',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f636',
    cardType: 'IntDebits',
    currentUsed: 0
  },
  {
    cardNumber: '4607000000000009',
    publisher: 'VISA',
    CVV: '737',
    PIN: '485325',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f636',
    cardType: 'IntDebits',
    currentUsed: 0
  },
  {
    cardNumber: '4000760000000001',
    publisher: 'VISA',
    CVV: '697',
    PIN: '759153',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f637',
    cardType: 'IntDebits',
    currentUsed: 0
  },
  {
    cardNumber: '4017340000000003',
    publisher: 'VISA',
    CVV: '831',
    PIN: '845632',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f637',
    cardType: 'IntDebits',
    currentUsed: 0
  },
  /////////MASTERCARD
  {
    cardNumber: '2222400060000007',
    publisher: 'MasterCard',
    CVV: '182',
    PIN: '110301',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f634',
    cardType: 'IntDebits',
    currentUsed: 0
  },
  {
    cardNumber: '2223520443560010',
    publisher: 'MasterCard',
    CVV: '141',
    PIN: '741236',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f634',
    cardType: 'IntDebits',
    currentUsed: 0
  },
  {
    cardNumber: '2222400070000005',
    publisher: 'MasterCard',
    CVV: '697',
    PIN: '147896',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f635',
    cardType: 'IntDebits',
    currentUsed: 0
  },
  {
    cardNumber: '5555341244441115',
    publisher: 'MasterCard',
    CVV: '831',
    PIN: '4545652',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f635',
    cardType: 'IntDebits',
    currentUsed: 0
  },

  /////////////////////////dom Debit/////////////////////////////
  //////////////////NAPAS
  {
    cardNumber: '9704250012345601',
    publisher: 'NAPAS',
    CVV: '828',
    PIN: '110280',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f639',
    cardType: 'DomDebits',
    currentUsed: 0
  },
  {
    cardNumber: '9704250065432110',
    publisher: 'NAPAS',
    CVV: '828',
    PIN: '110301',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61b99aafb3e43e32b664f639',
    cardType: 'DomDebits',
    currentUsed: 0
  }
]