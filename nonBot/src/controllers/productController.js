const Product = require('./../models/productModel')
const {getAdmin} = require('./adminController')

const getProducts = async (query) => {
  try {
    return await Product.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getProduct = async (query) => {
  try {
    return await Product.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeProduct = async (telegram_id) => {
  try {
    return await Product.create({author: telegram_id})
  } catch (e) {
    console.log(e)
  }
}

const updateProduct = async (query, data) => {
  try {
    return await Product.findOneAndUpdate(query, data)
  } catch (e) {
    console.log(e)
  }
}

const deleteProduct = async (query) => {
  try {
    return await Product.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countProduct = async (query) => {
  try {
    return await Product.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getProducts,
  getProduct,
  makeProduct,
  updateProduct,
  deleteProduct,
  countProduct
}
