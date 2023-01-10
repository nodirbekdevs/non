const {superAdminMainPage} = require('./mainPage')
const {superAdminSettings} = require('./settingsPage')
const {superAdminAdvertising, aas8} = require('./advertisingPage')
const {superAdminUsers} = require('./userPage')
const {updateAdmin} = require('./../../controllers/adminController')
const {genSalt, hash} = require('bcrypt')

const superAdminPanel = async (bot, message, admin) => {
  let text, username = '', password = ''

  const chat_id = message.chat.id

  if (message) {
    if (message.photo) {
      text = message.message.photo[0].file_id
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

    await superAdminMainPage(bot, chat_id, text)
    await superAdminSettings(bot, admin, text)
    await superAdminAdvertising(bot, chat_id, text)
    await superAdminUsers(bot, chat_id, text)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {superAdminPanel, aas8}
