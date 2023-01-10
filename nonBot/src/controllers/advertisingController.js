const Advertising = require('./../models/advertisingModel')
const {getAdmin} = require('./adminController')

const getAdvertisements = async (query) => {
  try {
    return await Advertising.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getAdvertising = async (query) => {
  try {
    return await Advertising.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeAdvertising = async (telegram_id) => {
  try {
    const admin = await getAdmin({telegram_id})
    const advertising = await Advertising.create({author: admin.telegram_id})
    admin.advertisements.push(advertising._id)
    admin.total_advertisements += 1
    await admin.save()
    return advertising
  } catch (e) {
    console.log(e)
  }
}

const updateAdvertising = async (query, data, text) => {
  try {
    return await Advertising.findOneAndUpdate(query, data)
  } catch (e) {
    console.log(e)
  }
}

const deleteAdvertising = async (query) => {
  try {
    const advertising = await getOneAdvertising(query)
    const admin = await getAdmin({telegram_id: advertising.author})
    if (admin) {
      admin.total_advertisements -= 1
      const index = admin.advertisements.indexOf(advertising._id)
      if (index > -1) admin.advertisements.splice(index)
      await admin.save()
    }
    return await Advertising.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countAdvertisements = async (query) => {
  try {
    return await Advertising.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getAdvertisements,
  getAdvertising,
  makeAdvertising,
  updateAdvertising,
  deleteAdvertising,
  countAdvertisements
}
