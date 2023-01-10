const Item = require('./../models/itemModel')
const {getUser} = require('./../controllers/userController')

const getItems = async (query) => {
  try {
    return await Item.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getItem = async (query) => {
  try {
    return await Item.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeItem = async (telegram_id, product_name) => {
  try {
    const user = await getUser({telegram_id})
    const item = await Item.create({author: user.telegram_id, product: product_name})
    return item
  } catch (e) {
    console.log(e)
  }
}

const updateItem = async (query, data) => {
  try {
    return await Item.findOneAndUpdate(query, data)
  } catch (e) {
    console.log(e)
  }
}

const deleteItem = async (query) => {
  try {
    return await Item.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countItems = async (query) => {
  try {
    return await Item.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getItems,
  getItem,
  makeItem,
  updateItem,
  deleteItem,
  countItems
}
