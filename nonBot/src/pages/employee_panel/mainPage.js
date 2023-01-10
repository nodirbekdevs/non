const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')

const emp = async (bot, chat_id, name) => {
  await bot.sendMessage(chat_id, `${name} nima qilamiz`, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.pages}
  })
}

const employeeMainPage = async (bot, chat_id, name, text) => {
  if (text === kb.start || text === kb.main.uz) await emp(bot, chat_id, name)

}

module.exports = {employeeMainPage}
