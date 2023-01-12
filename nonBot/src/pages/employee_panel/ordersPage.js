const kb = require('../../helpers/keyboard-buttons')
const keyboard = require('../../helpers/keyboard')
const {getOrders, getOrder, updateOrder} = require('../../controllers/orderController')
const {getProduct} = require('./../../controllers/productController')
const {getEmployee} = require('../../controllers/employeeController')
const {getItem} = require('./../../controllers/itemController')
const {getUser} = require('../../controllers/userController')
const {get_report} = require('./../../helpers/utils')

let order_id

const eos0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Buyurtmalar bo'limida nima qilamiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.orders}
  })
}

const eos1 = async (bot, chat_id) => {
  let message
  const orders = await getOrders({supplier: chat_id, should_deliver: true, status: 'approved'})

  if (orders.length > 0) {
    await get_report(orders, kb.language.uz, "EMPLOYEE_DELIVER", {bot, chat_id})
    message = "Buyurtmani tanlang"
  } else if (orders.length <= 0) {
    message = "Hali buyurtmalar yo'q"
  }

  await bot.sendMessage(chat_id, message)
}

const eos2 = async (bot, chat_id, _id) => {
  let user_info = ''

  const
    order = await getOrder({_id}),
    user = await getUser({telegram_id: order.author}),
    message = await get_report(order, kb.language.uz, "EMPLOYEE_OUT_OF_DELIVER")

  await updateOrder({_id}, {step: 12, status: 'out_of_delivery'})

  order_id = _id

  user_info += `Qabul qilib oluvchi\n`
  user_info += `Ismi: ${user.name}\n`
  user_info += `Telefon raqami: +${user.number}`

  await bot.sendMessage(chat_id, user_info)

  await bot.sendLocation(chat_id, order.location.latitude, order.location.longitude)

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.delivered, one_time_keyboard: true}
  })
}

const eos3 = async (bot, chat_id, _id) => {
  await updateOrder({_id}, {attempt: 2})

  await bot.sendMessage(chat_id, "Yetkazib berilganini tasdiqlash uchun mijozdan olgan imzoni jo'nating!")
}

const eos4 = async (bot, chat_id, _id, text) => {
  let total = 0

  await updateOrder({_id}, {signature: text, step: 13, status: 'delivered'})

  const order = await getOrder({_id}), user = await getUser({telegram_id: order.author}),
    employee = await getEmployee({telegram_id: chat_id}), items = order.items

  for (let i = 0; i < items.length; i++) {
    const item = await getItem({_id: items[i]}), product = await getProduct({name: item.product})

    item.step = 6
    item.status = 'delivered'
    await item.save()

    product.num_of_sold += item.quantity
    await product.save()

    total += item.quantity
  }

  if (user) {
    user.num_of_bought += total
    await user.save()
  }

  if (employee) {
    employee.orders.push(order._id)
    employee.total_orders += 1
    employee.num_of_delivered_product += total
    employee.is_idle = false
    await employee.save()
  }

  await bot.sendPhoto(employee.admin, text,{caption: `Buyurtma yetkazib berildi - ${user.name} ga`})

  await bot.sendMessage(chat_id, "Buyurtma yetkazib berildi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.orders}
  })
}

const eos5 = async (bot, chat_id) => {
  const orders = await getOrders({supplier: chat_id, step: 13, status: 'delivered'}), kbb = keyboard.employee.orders

  if (orders.length > 0) {
    await get_report(orders, kb.language.uz, "EMPLOYEE_ALL", {bot, chat_id})
  } else {
    const message = "Siz hali mahsulot yetkazib bermagansiz"
    await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
  }
}

const employeeOrders = async (bot, chat_id, text) => {
  const order = await getOrder({_id: order_id, supplier: chat_id, step: 12})
    ? await getOrder({_id: order_id, supplier: chat_id, step: 12})
    : (await getOrders({supplier: chat_id, step: 12}))[0]

  try {
    if (text === kb.employee.pages.orders) await eos0(bot, chat_id)
    if (text === kb.employee.orders.my_orders) await eos1(bot, chat_id)
    if (text === "Yetkazib bergan buyurtmalarim") await eos5(bot, chat_id)

    if (order) {
      if ((order.step === 12 && order.attempt === 1) || text === 'Yetkazib berildi') await eos3(bot, chat_id, order._id)
      if (order.step === 12 && order.attempt === 2) await eos4(bot, chat_id, order._id, text)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeeOrders, eos2}
