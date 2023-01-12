const {adminMainPage} = require('./mainPage')
const {adminSettings} = require('./settingsPage')
const {adminAdvertising, aas8} = require('./advertisingPage')
const {adminUsers} = require('./userPage')
const {adminFeedback} = require('./feedbackPage')
const {adminProducts} = require('./productsPage')
const {adminEmployees} = require('./employeePage')
const {adminOrders, aos3} = require('./orderPage')
const {getAdmin, updateAdmin} = require('./../../controllers/adminController')
const {getWorks} = require('./../../controllers/workController')
const {genSalt, hash} = require('bcrypt')

const adminPanel = async (bot, message, admin) => {
  let text, username = '', password = ''

  const chat_id = message.chat.id

  if (message) {
    if (message.photo) {
      text = message.photo[0].file_id
    }
    if (message.text) {
      text = message.text
    }
    if (message.from.username !== "") {
      username = message.from.username
    }
  }

  try {
    if (username) {
      if (admin.username !== username) {
        const salt = await genSalt()
        password = await hash(username, salt)

        await updateAdmin({telegram_id: chat_id}, {username, password})
      }
    }

    await adminMainPage(bot, chat_id, text)
    await adminSettings(bot, admin, text)
    await adminProducts(bot, chat_id, text)
    await adminAdvertising(bot, chat_id, text)
    await adminUsers(bot, chat_id, text)
    await adminFeedback(bot, chat_id, text)
    await adminEmployees(bot, chat_id, text)
    await adminOrders(bot, chat_id, text)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {adminPanel, getAdmin, getWorks, aos3, aas8}
