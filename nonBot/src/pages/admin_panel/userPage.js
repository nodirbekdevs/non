const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {countUsers} = require('./../../controllers/userController')

const aus0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Foydalanuvchilar bo'limi nima qilamiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.users}
  })
}

const aus1 = async (bot, chat_id) => {
  let message = ''

  const number = await countUsers({}), process = await countUsers({status: 'process'}),
    active = await countUsers({status: 'active'})

  message += `Umumiy foydalanuvchilar soni - ${number}`
  message += `Registratsiyadan o'tayotgan foydalanuvchilar soni - ${process}`
  message += `Registratsiyadan o'tgan foydalanuvchilar soni - ${active}`

  await bot.sendMessage(chat_id, message)
}

const adminUsers = async (bot, chat_id, text) => {
  try {
    if (text === kb.admin.pages.users) await aus0(bot, chat_id)

    if (text === kb.admin.users.number) await aus1(bot, chat_id)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {adminUsers}
