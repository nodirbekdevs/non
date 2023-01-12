const kb = require('../../helpers/keyboard-buttons')
const keyboard = require('../../helpers/keyboard')
const {getOrders} = require('../../controllers/orderController')

const urs0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Hisobotlar bo'limi"
    kbb = keyboard.user.reports.uz
  } else {
    message = "Раздел отчетов"
    kbb = keyboard.user.reports.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const urs1 = async (bot, chat_id, lang) => {
  let message, u_orders = [], total = 0
  const kbb = (lang === kb.language.uz) ? keyboard.user.reports.uz : keyboard.user.reports.ru

  const orders = await getOrders({author: chat_id})

  orders.map(async order => {
    if (order.status !== 'process' || order.status !== 'inactive') {
      u_orders.push(order)
    }
  })

  if (u_orders.length > 0) {
    u_orders.map(order => total += order.price)

    message = (lang === kb.language.uz)
      ? `Siz ${total} lik non mahsulotlarimizga buyurtma bergansiz`
      : `Вы заказали ${total} наших хлебобулочных изделий`
  } else if (u_orders.length <= 0) {
    message = (lang === kb.language.uz)
      ? 'Sizga hali non mahsulotlarimizni buyurtma bermagansiz'
      : 'Вы еще не заказали наш хлебобулочных изделий'
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const urs2 = async (bot, chat_id, lang) => {
  let message = '', ud_orders = [], total = 0
  const kbb = (lang === kb.language.uz) ? keyboard.user.reports.uz : keyboard.user.reports.ru,
    orders = await getOrders({author: chat_id})

  orders.map(order => {
    if (order.status === 'delivered') ud_orders.push(order)
  })

  if (ud_orders.length > 0) {
    ud_orders.map(order => total += order.price)
    message = (lang === kb.language.uz)
      ? `Sizga ${total} lik non mahsulotimiz yetkazib berilgan`
      : `${total} наших хлебобулочных изделий доставлено вам`
  } else if (ud_orders.length <= 0) {
    message = (lang === kb.language.uz)
      ? 'Sizga hali non mahsulotimiz yetkazib berilmagan'
      : 'Наша хлебо булочная продукция вам еще не доставлена'
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const urs3 = async (bot, chat_id, lang) => {
  let message = '', ua_orders = [], total = 0
  const kbb = (lang === kb.language.uz) ? keyboard.user.reports.uz : keyboard.user.reports.ru,
    orders = await getOrders({author: chat_id})


  orders.map(order => {
    if (order.status === 'accepted') ua_orders.push(order)
  })

  if (ua_orders.length > 0) {
    ua_orders.map(order => total += order.price)

    message = (lang === kb.language.uz)
      ? `Siz ${total} lik non mahsulotimizni qabul qilib olgansiz`
      : `Вы получили наш хлеб ${total}`
  } else if (ua_orders.length <= 0) {
    message = (lang === kb.language.uz)
      ? 'Sizga hali non mahsulotimizni qabul qilib olmagansiz'
      : 'Вы еще не получили наши хлебобулочные изделия'
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const userReports = async (bot, chat_id, lang, text) => {
  try {
    if (text === kb.user.pages.uz.report || text === kb.user.pages.ru.report) await urs0(bot, chat_id, lang)
    if (text === kb.user.reports.uz.number || text === kb.user.reports.ru.number) await urs1(bot, chat_id, lang)
    if (text === kb.user.reports.uz.delivered || text === kb.user.reports.ru.delivered) await urs2(bot, chat_id, lang)
    if (text === kb.user.reports.uz.accepted || text === kb.user.reports.ru.accepted) await urs3(bot, chat_id, lang)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {userReports}
