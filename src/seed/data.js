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