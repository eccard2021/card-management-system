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
    image: '/',
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
    image: '/',
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
    image: '/',
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
    image: '/',
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
    image: '/',
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
    image: '/',
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
    image: '/',
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
    image: '/',
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
    image: '/',
    cardRank: 'Standard',
    description: 'Thẻ ghi nợ nội địa Napas Standard, cho thép thanh toán trực tuyến trên các website có biểu tượng của LTS Bank trong nội địa Quốc Gia',
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
    cardNumber: '4000 0200 0000 0000',
    publisher: 'VISA',
    CVV: '828',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d588c',
    cardType: 'IntCredits'
  },
  {
    cardNumber: '4484 6000 0000 0004',
    publisher: 'VISA',
    CVV: '737',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d588c',
    cardType: 'IntCredits'
  },
  {
    cardNumber: '4000 6400 0000 0005',
    publisher: 'VISA',
    CVV: '697',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d588d',
    cardType: 'IntCredits'
  },
  {
    cardNumber: '4003 5500 0000 0003',
    publisher: 'VISA',
    CVV: '831',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d588d',
    cardType: 'IntCredits'
  },
  /////////MASTERCARD
  {
    cardNumber: '2223 0000 4841 0010',
    publisher: 'MasterCard',
    CVV: '182',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d588e',
    cardType: 'IntCredits'
  },
  {
    cardNumber: '2222 4000 1000 0008',
    publisher: 'MasterCard',
    CVV: '141',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d588e',
    cardType: 'IntCredits'
  },
  {
    cardNumber: '5100 0600 0000 0002',
    publisher: 'MasterCard',
    CVV: '697',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d588f',
    cardType: 'IntCredits'
  },
  {
    cardNumber: '2222 4000 3000 0004',
    publisher: 'MasterCard',
    CVV: '831',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d588f',
    cardType: 'IntCredits'
  },
  /////////////////////////INT Debit/////////////////////////////
  //////////////////VISA
  {
    cardNumber: '4000 1600 0000 0004',
    publisher: 'VISA',
    CVV: '828',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d5893',
    cardType: 'IntDebits'
  },
  {
    cardNumber: '4607 0000 0000 0009',
    publisher: 'VISA',
    CVV: '737',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d5893',
    cardType: 'IntDebits'
  },
  {
    cardNumber: '4000 7600 0000 0001',
    publisher: 'VISA',
    CVV: '697',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d5894',
    cardType: 'IntDebits'
  },
  {
    cardNumber: '4017 3400 0000 0003',
    publisher: 'VISA',
    CVV: '831',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d5894',
    cardType: 'IntDebits'
  },
  /////////MASTERCARD
  {
    cardNumber: '2222 4000 6000 0007',
    publisher: 'MasterCard',
    CVV: '182',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d5891',
    cardType: 'IntDebits'
  },
  {
    cardNumber: '2223 5204 4356 0010',
    publisher: 'MasterCard',
    CVV: '141',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d5891',
    cardType: 'IntDebits'
  },
  {
    cardNumber: '2222 4000 7000 0005',
    publisher: 'MasterCard',
    CVV: '697',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d5892',
    cardType: 'IntDebits'
  },
  {
    cardNumber: '5555 3412 4444 1115',
    publisher: 'MasterCard',
    CVV: '831',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d5892',
    cardType: 'IntDebits'
  },

  /////////////////////////dom Debit/////////////////////////////
  //////////////////NAPAS
  {
    cardNumber: '9704 2500 1234 5601',
    publisher: 'NAPAS',
    CVV: '828',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d5896',
    cardType: 'DomDebits'
  },
  {
    cardNumber: '9704 2500 6543 2110',
    publisher: 'NAPAS',
    CVV: '828',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: '61a88590e5630c69fe5d5896',
    cardType: 'DomDebits'
  }
]