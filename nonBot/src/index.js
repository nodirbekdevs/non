const TelegramBot = require('node-telegram-bot-api')
const config = require('./helpers/config')
const db = require('./helpers/db')
const kb = require('./helpers/keyboard-buttons')
const {userPanel, getUser, getOrders, ups4, uos13, uos19} = require('./pages/user_panel/userPanel')
const {adminPanel, getAdmin, getWorks, aos3, aas8} = require('./pages/admin_panel/adminPanel')
const {employeePanel, getEmployee, eos2} = require('./pages/employee_panel/employeePanel')

const bot = new TelegramBot(config.TOKEN, {db, polling: true})

bot.setMyCommands(
  [
    {command: '/start', description: 'Start the bot'}
  ]
).then()

bot.on('message', async message => {
  const query = {telegram_id: message.from.id, status: 'active'}, admin = await getAdmin(query),
    employee = await getEmployee(query), work = (await getWorks({}))[0]

  try {
    if (admin) await adminPanel(bot, message, admin)
    else if (employee) await employeePanel(bot, message, employee)
    else await userPanel(bot, message)
    // else if (work.type === "On") await userPanel(bot, message)
    // if (work.type === "Off") await bot.sendMessage(message.from.id, work.description)
  } catch (e) {
    console.log(e + '')
  }
})

bot.on('callback_query', async query => {
  const query_id = query.id, telegram_id = query.from.id, mid = query.message.message_id,
    data = query.data, {phrase, id} = JSON.parse(data)

  const request = {telegram_id}, user = await getUser(request),
    admin = await getAdmin(request), employee = await getEmployee(request)

  if (admin) {
    if (phrase === "SEND_AD") await aas8(bot, telegram_id, id)
    if (phrase === 'DELIVER') {
      await aos3(bot, telegram_id, id)
    }
  }

  if (user) {
    if (phrase === kb.options.day.uz || phrase === kb.options.day.ru) {
      const order = (await getOrders({author: telegram_id, status: 'process'}))[0]
      await uos13(bot, telegram_id, order._id, user.lang, id)
    }
    if (phrase === "RECEIVE") await uos19(bot, telegram_id, user.lang, id)
    if (phrase === 'inline') {
      const text = (user.lang === kb.language.uz) ? "Iltimos to'g'ri sanani kiriting" : "Пожалуйста, введите правильную дату"
      await bot.sendMessage(telegram_id, text)
    }
    if (phrase === 'ADD' || phrase === 'REMOVE' || phrase === 'BASKET') await ups4(bot, telegram_id, user.lang, phrase, id)
  }

  if (employee) {
    if (phrase === 'deliver') {
      await eos2(bot, telegram_id, id)
    }
  }
})
