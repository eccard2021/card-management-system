require('dotenv').config()
import { users, intCredits, intDebits, domDebits, services, cardList } from './data.js'
import User from '../models/user.model'
import { IntCredits, IntDebits, DomDebits } from '../models/cardTypes.model.js'
import Service from '../models/service.model.js'
import { connectDB } from '../config/db'
import CardList from '../models/cardList.model.js'

connectDB()
  .then(() => console.log('Connected succesfully to database server!'))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

const deleteData = async () => {
  //await User.deleteMany()
  // await IntCredits.deleteMany()
  // await IntDebits.deleteMany()
  // await DomDebits.deleteMany()
  // await Service.deleteMany()
  await CardList.deleteMany()
}

const importData = async () => {
  try {
    await deleteData()
    //await User.insertMany(users)
    //await IntCredits.insertMany(intCredits)
    //await IntDebits.insertMany(intDebits)
    //await DomDebits.insertMany(domDebits)
    //await Service.insertMany(services)
    await CardList.insertMany(cardList)
    console.log('Data Imported !')
    process.exit()

  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}


const destroyData = async () => {
  try {
    await deleteData()
    console.log('Data destroyed !')
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
}
else { importData() }