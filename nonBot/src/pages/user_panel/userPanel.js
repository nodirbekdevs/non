const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
// const dayjs = require('dayjs')
// const weekOfYear = require('dayjs/plugin/weekOfYear')
const {genSalt, hash} = require('bcrypt')
const {mainPage} = require('./mainPage')
const {userRegister} = require('./register')
const {userSettings} = require('./settingsPage')
const {userReports} = require('./reportPage')
const {userFeedback} = require('./feedbackPage')
const {userProduct, ups4} = require('./productsPage')
const {userOrder, uos13, uos19} = require('./ordersPage')
const {getUser, updateUser, makeUser} = require('./../../controllers/userController')
const {getOrders} = require('./../../controllers/orderController')

let lang

const userPanel = async (bot, message) => {
  let text, username = "", password = ""
  const telegram_id = message.from.id, first_name = message.from.first_name

  // const date = new Date(), today = date.getDate() - 30, year = date.getFullYear() + 1, month = date.getMonth() -10, week = new Date(year, month, 1)
  // dayjs.extend(weekOfYear);
  // const day = `01-${month}-${year}`, days = dayjs(day).week(week).toDate()
  // console.log(date)
  // console.log(date.getDate())
  // console.log(date.getDay())
  // console.log(Math.ceil((date.getDate() - 1 - date.getDay()) / 7))
  // // console.log(today)
  // // console.log(year)
  // // console.log(month)
  // // console.log(week.getDay())
  // // console.log(days)

  try {
    if (message) {
      if (message.contact) {
        text = message.contact.phone_number
      }
      if (message.location) {
        text = message.location
      }
      if (message.text) {
        text = message.text
      }
      if (message.from.username !== "") {
        username = message.from.username
      }
    }

    if (text === kb.language.uz || text === kb.language.ru) await updateUser({telegram_id}, {lang: text})

    const user = await getUser({telegram_id})

    if (!user && text === kb.start) {
      if (username) {
        const salt = await genSalt()
        password = await hash(username, salt)
      }
      await makeUser({telegram_id, username, password})

      await bot.sendMessage(telegram_id, `Bo'timizga xush kelibsiz ${first_name}. Tilni tanlang \nДобро пожаловать ${first_name}. Выберите язык`, {
        reply_markup: {resize_keyboard: true, keyboard: keyboard.language, one_time_keyboard: true}
      })
    }

    if (user) {
      lang = user.lang

      if (user.step < 3) await userRegister(bot, user, telegram_id, lang, text)

      if (user.status === 'active' && user.step >= 3) {
        const name = user.name

        if (username) {
          if (user.username !== username) {
            const salt = await genSalt()
            password = await hash(username, salt)

            await updateUser({telegram_id}, {username, password})
          }
        }

        if (text === kb.main.uz || text === kb.main.ru || text === kb.start) await mainPage(bot, telegram_id, name, lang)

        await userSettings(bot, user, lang, text)
        await userFeedback(bot, telegram_id, name, lang, text)
        await userOrder(bot, telegram_id, lang, text)
        await userProduct(bot, telegram_id, lang, text)
        await userReports(bot, telegram_id, lang, text)

        if (text === kb.user.pages.uz.location || text === kb.user.pages.ru.location) await bot.sendMessage(telegram_id, "Tez kunda")
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {userPanel, getUser, getOrders, ups4, uos13, uos19}
