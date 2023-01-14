const Order = require('./../models/orderModel')
const {getUser} = require('./userController')
const {getAdmins} = require('./adminController')
const {getEmployee} = require('./employeeController')

const getOrders = async (query) => {
  try {
    return await Order.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getOrder = async (query) => {
  try {
    return await Order.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeOrder = async (telegram_id) => {
  try {
    const admin = (await getAdmins({}))[0]
    const user = await getUser({telegram_id})
    return await Order.create({admin: admin.telegram_id, author: user.telegram_id})
  } catch (e) {
    console.log(e)
  }
}

const updateOrder = async (query, data) => {
  try {
    return await Order.findOneAndUpdate(query, data)
  } catch (e) {
    console.log(e)
  }
}

const deleteOrder = async (query) => {
  try {
    const order = await getOrder(query), employee = await getEmployee({_id: order.supplier})

    if (employee) {
      const index = employee.orders.indexOf(order._id)
      if (index > -1) {
        employee.orders.splice(index, 1)
        employee.total_orders -= 1
        await employee.save()
      }
    }

    return await Order.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countOrders = async (query) => {
  try {
    return await Order.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getOrders,
  getOrder,
  makeOrder,
  updateOrder,
  deleteOrder,
  countOrders
}
