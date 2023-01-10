const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')

const amp = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, `Bosh sahifa`, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.super_admin.pages}
  })
}

const superAdminMainPage = async (bot, chat_id, text) => {
    if (text === kb.start || text === kb.main.uz) await amp(bot, chat_id)
}

module.exports = {superAdminMainPage}
