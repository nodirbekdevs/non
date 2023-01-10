const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getEmployees, getEmployee, updateEmployee} = require('./../../controllers/employeeController')
const {getOrders, getOrder, updateOrder} = require('./../../controllers/orderController')
const {updateItem} = require('./../../controllers/itemController')
const {get_report} = require('./../../helpers/utils')

let order_id

const aos0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Buyurtmalar bo'limida nima qilamiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.orders}
  })
}

const aos1 = async (bot, chat_id) => {
  let number, active = 0, inactive = 0, approved = 0, out_of_delivery = 0, delivered = 0, accepted = 0

  const orders = await getOrders({})

  if (orders.length > 0) {
    number = orders.length

    orders.map(item => {
      if (item.status === 'active') active += 1
      if (item.status === 'inactive') inactive += 1
      if (item.status === 'approved') approved += 1
      if (item.status === 'out_of_delivery') out_of_delivery += 1
      if (item.status === 'delivered') delivered += 1
      if (item.status === 'accepted') accepted += 1
    })
  } else {
    number = 0;
    active = 0;
    inactive = 0;
    approved = 0;
    out_of_delivery = 0;
    delivered = 0;
    accepted = 0;
  }


  const message = `
    Barcha buyurtmalar: ${number}
    Tayyorlanishi kerak bo'lgan buyurtmalar: ${active}
    Noto'g'ri buyurtmalar: ${inactive}
    Yetkazib berish uchun tasdiqlangan buyurtmalar: ${approved}
    Yetkazib berilayotgan buyurtmalar: ${out_of_delivery}
    Yetkazib berilan buyurtmalar: ${delivered}
    Qabul qilib olingan buyurtmalar: ${accepted}
  `

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.orders}})
}

const aos2 = async (bot, chat_id) => {
  let message
  const orders = await getOrders({should_deliver: true, status: 'active'})

  if (orders.length > 0) {
    await get_report(orders, kb.language.uz, "ADMIN", {bot, chat_id})
    message = "Buyurtmani tanlang"
  } else if (orders.length <= 0) {
    message = "Hali buyurtmalar yo'q"
  }

  await bot.sendMessage(chat_id, message)
}

const aos3 = async (bot, chat_id, _id) => {
  let buttons = [];

  order_id = _id

  await updateOrder({_id}, {step: 10})

  const employees = await getEmployees({is_idler: false, task: kb.options.task.supplier})

  employees.map(e => buttons.push([{text: e.name}]))

  buttons.push([{text: kb.options.back.uz}])

  await bot.sendMessage(chat_id, "Yetkazib beruvchini tanlang", {
    reply_markup: {resize_keyboard: true, keyboard: buttons, one_time_keyboard: true}
  })
}

const aos4 = async (bot, chat_id, _id) => {
  await updateOrder({_id}, {step: 10})
  await aos2(bot, chat_id)
}

const aos5 = async (bot, chat_id, _id, text) => {
  const employee = await getEmployee({name: text})

  await updateOrder({_id}, {supplier: employee.telegram_id, step: 11, status: 'approved'})

  const order = await getOrder({_id}), items = order.items

  for (let i = 0; i < items.length; i++) {
    await updateItem({_id: items[i]}, {step: 4, status: 'approved'})
  }

  await updateEmployee({_id}, {is_idler: true})

  await bot.sendMessage(employee.telegram_id, "Sizda yangi yetkazib berish kerak bo'lgan buyurtma bor")

  await bot.sendMessage(chat_id, `Yetkazib beruvchi - ${employee.name} biriktirildi`, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.admin.orders
    }
  })
}

const adminOrders = async (bot, chat_id, text) => {
  const order = await getOrder({_id: order_id, status: 'active'})
    ? await getOrder({_id: order_id, status: 'active'})
    : (await getOrders({status: 'active'}))[0]

  try {
    if (text === kb.admin.pages.orders) await aos0(bot, chat_id)

    if (text === kb.admin.orders.number) await aos1(bot, chat_id)

    if (text === kb.admin.orders.confirm_deliver) await aos2(bot, chat_id)

    if (order) {
      if (text === kb.options.back.uz) await aos4(bot, chat_id, order._id)

      if (order.step === 10) await aos5(bot, chat_id, order._id, text)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {adminOrders, aos3}
