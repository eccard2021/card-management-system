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
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
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
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    balance: 100000000
  }
]

export const intCredits = [
  {
    cardUrl: 'the-tin-dung-vpbank-shopee-platinum-1',
    cardName: 'Thẻ tín dụng VPBank Shopee Platinum',
    image: '/',
    cardRank: 'platinum',
    description: 'Đơn hàng là từng đặt hàng ở mỗi đơn vị bán hàng. Trong 1 giao dịch thanh toán bằng thẻ có thể có nhiều đơn hàng. Ví dụ: GD qua thẻ Shopee Platinum  900k: gồm 1 đơn hàng mua hàng tại Shop A1: giá 400k; 1 đơn hàng mua hàng tại Shop A2: giá 200k; 1 đơn hàng mua hàng tại Shop A3: giá 300k. Như vậy đơn hàng tại Shop A1 và A3 sẽ được áp dụng mã miễn phí. Đơn hàng tại Shop A2 không được hưởng mã miễn ph',
    creditLine: 3,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 10,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-tin-dung-vpbank-shopee-platinum-2',
    cardName: 'Thẻ tín dụng VPBank Shopee Platinum',
    image: '/',
    cardRank: 'gold',
    description: 'Đơn hàng là từng đặt hàng ở mỗi đơn vị bán hàng. Trong 1 giao dịch thanh toán bằng thẻ có thể có nhiều đơn hàng. Ví dụ: GD qua thẻ Shopee Platinum  900k: gồm 1 đơn hàng mua hàng tại Shop A1: giá 400k; 1 đơn hàng mua hàng tại Shop A2: giá 200k; 1 đơn hàng mua hàng tại Shop A3: giá 300k. Như vậy đơn hàng tại Shop A1 và A3 sẽ được áp dụng mã miễn phí. Đơn hàng tại Shop A2 không được hưởng mã miễn ph',
    creditLine: 3,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 10,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-tin-dung-vpbank-shopee-platinum-3',
    cardName: 'Thẻ tín dụng VPBank Shopee Platinum',
    image: '/',
    cardRank: 'silver',
    description: 'Đơn hàng là từng đặt hàng ở mỗi đơn vị bán hàng. Trong 1 giao dịch thanh toán bằng thẻ có thể có nhiều đơn hàng. Ví dụ: GD qua thẻ Shopee Platinum  900k: gồm 1 đơn hàng mua hàng tại Shop A1: giá 400k; 1 đơn hàng mua hàng tại Shop A2: giá 200k; 1 đơn hàng mua hàng tại Shop A3: giá 300k. Như vậy đơn hàng tại Shop A1 và A3 sẽ được áp dụng mã miễn phí. Đơn hàng tại Shop A2 không được hưởng mã miễn ph',
    creditLine: 3,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 10,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-tin-dung-vpbank-shopee-platinum-4',
    cardName: 'Thẻ tín dụng VPBank Shopee Platinum',
    image: '/',
    cardRank: 'gold',
    description: 'Đơn hàng là từng đặt hàng ở mỗi đơn vị bán hàng. Trong 1 giao dịch thanh toán bằng thẻ có thể có nhiều đơn hàng. Ví dụ: GD qua thẻ Shopee Platinum  900k: gồm 1 đơn hàng mua hàng tại Shop A1: giá 400k; 1 đơn hàng mua hàng tại Shop A2: giá 200k; 1 đơn hàng mua hàng tại Shop A3: giá 300k. Như vậy đơn hàng tại Shop A1 và A3 sẽ được áp dụng mã miễn phí. Đơn hàng tại Shop A2 không được hưởng mã miễn ph',
    creditLine: 3,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 10,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-tin-dung-vpbank-shopee-platinum-5',
    cardName: 'Thẻ tín dụng VPBank Shopee Platinum',
    image: '/',
    cardRank: 'platinum',
    description: 'Đơn hàng là từng đặt hàng ở mỗi đơn vị bán hàng. Trong 1 giao dịch thanh toán bằng thẻ có thể có nhiều đơn hàng. Ví dụ: GD qua thẻ Shopee Platinum  900k: gồm 1 đơn hàng mua hàng tại Shop A1: giá 400k; 1 đơn hàng mua hàng tại Shop A2: giá 200k; 1 đơn hàng mua hàng tại Shop A3: giá 300k. Như vậy đơn hàng tại Shop A1 và A3 sẽ được áp dụng mã miễn phí. Đơn hàng tại Shop A2 không được hưởng mã miễn ph',
    creditLine: 3,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 10,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-tin-dung-vpbank-shopee-platinum-6',
    cardName: 'Thẻ tín dụng VPBank Shopee Platinum',
    image: '/',
    cardRank: 'gold',
    description: 'Đơn hàng là từng đặt hàng ở mỗi đơn vị bán hàng. Trong 1 giao dịch thanh toán bằng thẻ có thể có nhiều đơn hàng. Ví dụ: GD qua thẻ Shopee Platinum  900k: gồm 1 đơn hàng mua hàng tại Shop A1: giá 400k; 1 đơn hàng mua hàng tại Shop A2: giá 200k; 1 đơn hàng mua hàng tại Shop A3: giá 300k. Như vậy đơn hàng tại Shop A1 và A3 sẽ được áp dụng mã miễn phí. Đơn hàng tại Shop A2 không được hưởng mã miễn ph',
    creditLine: 3,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 10,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-tin-dung-vpbank-shopee-platinum-7',
    cardName: 'Thẻ tín dụng VPBank Shopee Platinum',
    image: '/',
    cardRank: 'silver',
    description: 'Đơn hàng là từng đặt hàng ở mỗi đơn vị bán hàng. Trong 1 giao dịch thanh toán bằng thẻ có thể có nhiều đơn hàng. Ví dụ: GD qua thẻ Shopee Platinum  900k: gồm 1 đơn hàng mua hàng tại Shop A1: giá 400k; 1 đơn hàng mua hàng tại Shop A2: giá 200k; 1 đơn hàng mua hàng tại Shop A3: giá 300k. Như vậy đơn hàng tại Shop A1 và A3 sẽ được áp dụng mã miễn phí. Đơn hàng tại Shop A2 không được hưởng mã miễn ph',
    creditLine: 3,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 10,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-tin-dung-vpbank-shopee-platinum-8',
    cardName: 'Thẻ tín dụng VPBank Shopee Platinum',
    image: '/',
    cardRank: 'gold',
    description: 'Đơn hàng là từng đặt hàng ở mỗi đơn vị bán hàng. Trong 1 giao dịch thanh toán bằng thẻ có thể có nhiều đơn hàng. Ví dụ: GD qua thẻ Shopee Platinum  900k: gồm 1 đơn hàng mua hàng tại Shop A1: giá 400k; 1 đơn hàng mua hàng tại Shop A2: giá 200k; 1 đơn hàng mua hàng tại Shop A3: giá 300k. Như vậy đơn hàng tại Shop A1 và A3 sẽ được áp dụng mã miễn phí. Đơn hàng tại Shop A2 không được hưởng mã miễn ph',
    creditLine: 3,
    statmentDay: 25,
    payWithin: 45,
    interestRate: 10,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  }
]
export const intDebits = [
  {
    cardUrl: 'the-ghi-no-quoc-te-vpbank-diamond-1',
    cardName: 'Thẻ ghi nợ quốc tế VPBank Diamond',
    image: '/',
    cardRank: 'gold',
    description:
      'Được phát hành theo tiêu chuẩn EMV với độ bảo mật rất cao, con chip được thiết kế ở mặt trước của thẻ để lưu giữ thông tin khách hàng',
    maxPay: 3,
    maxDraw: 500000000,
    maxDrawTime: 45,
    maxTransfer: 2,
    transferFee: 0.2,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-ghi-no-quoc-te-vpbank-diamond-2',
    cardName: 'Thẻ ghi nợ quốc tế VPBank Diamond',
    image: '/',
    cardRank: 'silver',
    description:
      'Được phát hành theo tiêu chuẩn EMV với độ bảo mật rất cao, con chip được thiết kế ở mặt trước của thẻ để lưu giữ thông tin khách hàng',
    maxPay: 3,
    maxDraw: 500000000,
    maxDrawTime: 45,
    maxTransfer: 2,
    transferFee: 0.2,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-ghi-no-quoc-te-vpbank-diamond-3',
    cardName: 'Thẻ ghi nợ quốc tế VPBank Diamond',
    image: '/',
    cardRank: 'platinum',
    description:
      'Được phát hành theo tiêu chuẩn EMV với độ bảo mật rất cao, con chip được thiết kế ở mặt trước của thẻ để lưu giữ thông tin khách hàng',
    maxPay: 3,
    maxDraw: 500000000,
    maxDrawTime: 45,
    maxTransfer: 2,
    transferFee: 0.2,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-ghi-no-quoc-te-vpbank-diamond-4',
    cardName: 'Thẻ ghi nợ quốc tế VPBank Diamond',
    image: '/',
    cardRank: 'gold',
    description:
      'Được phát hành theo tiêu chuẩn EMV với độ bảo mật rất cao, con chip được thiết kế ở mặt trước của thẻ để lưu giữ thông tin khách hàng',
    maxPay: 3,
    maxDraw: 500000000,
    maxDrawTime: 45,
    maxTransfer: 2,
    transferFee: 0.2,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  }
]

export const domDebits = [
  {
    cardUrl: 'the-ghi-no-noi-dia-autolink-1',
    cardName: 'Thẻ ghi nợ nội địa AutoLink',
    image: '/',
    cardRank: 'gold',
    description:
      'Được phát hành theo tiêu chuẩn EMV với độ bảo mật rất cao, con chip được thiết kế ở mặt trước của thẻ để lưu giữ thông tin khách hàng',
    maxDraw: 500000000,
    maxDrawTime: 45,
    maxTransfer: 2,
    transferFee: 0.2,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-ghi-no-noi-dia-autolink-2',
    cardName: 'Thẻ tín dụng VPBank Shopee Platinum',
    image: '/',
    cardRank: 'silver',
    description:
      'Được phát hành theo tiêu chuẩn EMV với độ bảo mật rất cao, con chip được thiết kế ở mặt trước của thẻ để lưu giữ thông tin khách hàng',
    maxDraw: 500000000,
    maxDrawTime: 45,
    maxTransfer: 2,
    transferFee: 0.2,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-ghi-no-noi-dia-autolink-3',
    cardName: 'Thẻ ghi nợ nội địa AutoLink',
    image: '/',
    cardRank: 'platinum',
    description:
      'Được phát hành theo tiêu chuẩn EMV với độ bảo mật rất cao, con chip được thiết kế ở mặt trước của thẻ để lưu giữ thông tin khách hàng',
    maxDraw: 500000000,
    maxDrawTime: 45,
    maxTransfer: 2,
    transferFee: 0.2,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  },
  {
    cardUrl: 'the-ghi-no-noi-dia-autolink-4',
    cardName: 'Thẻ ghi nợ nội địa AutoLink',
    image: '/',
    cardRank: 'gold',
    description:
      'Được phát hành theo tiêu chuẩn EMV với độ bảo mật rất cao, con chip được thiết kế ở mặt trước của thẻ để lưu giữ thông tin khách hàng',
    maxDraw: 500000000,
    maxDrawTime: 45,
    maxTransfer: 2,
    transferFee: 0.2,
    issueFee: 0.5,
    reIssueFee: 1,
    rePINFee: 0.5,
    yearlyFee: 0.25,
    inDrawFee: 0.05,
    outDrawFee: 0.1
  }
]

export const services = [
  {
    service_name: 'NAP TIEN PAYPAL',
    fixedfee: 0.6,
    fee_rate: 0.035,
    action: SERVICE_ACTION_TYPE.CHARGE
  },
  {
    service_name: 'RUT TIEN PAYPAL',
    fixedfee: 0,
    fee_rate: 0,
    action: SERVICE_ACTION_TYPE.WITHDRAW
  },
  {
    service_name: 'CHUYEN TIEN TRONG NGAN HANG',
    fixedfee: 0,
    fee_rate: 0.003,
    action: SERVICE_ACTION_TYPE.TRANSFER
  },
  {
    service_name: 'THANH TOAN ONLINE',
    fixedfee: 0,
    fee_rate: 0.035,
    action: SERVICE_ACTION_TYPE.PAYMENT
  },
  {
    service_name: 'PHI DUY TRI TAI KHOAN',
    fixedfee: 0.49,
    fee_rate: 0.0349,
    action: SERVICE_ACTION_TYPE.MONTHLY_FEE
  }
]