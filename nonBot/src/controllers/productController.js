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
    const product = await getProduct(query)
    const admin = await getAdmin({_id: product.author})
    if (admin) {
      admin.total_products -= 1
      const index = admin.products.indexOf(product._id)
      if (index > -1) admin.products.splice(index)
      await admin.save()
    }
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
