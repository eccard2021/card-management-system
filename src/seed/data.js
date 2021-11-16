import bcrypt from 'bcryptjs'

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

export const cardTypes = {
  intCredits: [
    {
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
  ],
  intDebits: [
    {
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
  ],
  domDebits: [
    {
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
}
