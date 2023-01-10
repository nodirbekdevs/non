const keyboard = require('./../../helpers/keyboard')
const kb = require('./../../helpers/keyboard-buttons')
const {updateAdmin} = require('../../controllers/adminController')

let type

const asst0 = async (bot, admin) => {
  const message = `Ma'lumotlaringiz: \n \n Ismingiz - ${admin.name}.\n
  Telefon raqamingiz - ${admin.number}. \n
  Username - ${admin.username}. \n
  Nimani o'zgartirmoqchisiz`

  await updateAdmin({telegram_id: admin.telegram_id}, {step: 1})

  await bot.sendMessage(admin.telegram_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.super_admin.settings}
  })

}

const asst1 = async (bot, chat_id) => {
  await updateAdmin({telegram_id: chat_id}, {step: 2})
  await bot.sendMessage(chat_id, "O'zgartirmoqchi bo'lgan ismingizni kiriting")
}

const asst2 = async (bot, chat_id, text) => {
  await updateAdmin({telegram_id: chat_id}, {name: text, step: 1})

  await bot.sendMessage(chat_id, "Ismingiz muvaffaqiyatli o'zgartirildi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.super_admin.settings}
  })
}

const asst3 = async (bot, chat_id) => {
  await updateAdmin({telegram_id: chat_id}, {step: 2})

  await bot.sendMessage(chat_id, "O'zgartirmoqchi bo'lgan raqamingizni kiriting")
}

const asst4 = async (bot, chat_id, text) => {
  await updateAdmin({telegram_id: chat_id}, {number: text, step: 1})

  await bot.sendMessage(chat_id, "Raqamingiz muvaffaqiyatli o'zgartirildi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.super_admin.settings}
  })
}

const superAdminSettings = async (bot, admin, text) => {
  try {
    if (text === kb.super_admin.pages.settings) await asst0(bot, admin)

    if (admin.step === 1 && text === kb.main.uz) await updateAdmin({telegram_id: admin.telegram_id}, {step: 0})

    if (admin.step === 1) {
      if (text === kb.super_admin.settings.name) await asst1(bot, admin.telegram_id)

      if (text === kb.super_admin.settings.number) await asst3(bot, admin.telegram_id)
      type = text
    } else if (admin.step === 2) {
      if (type === kb.super_admin.settings.name) await asst2(bot, admin.telegram_id, text)

      if (type === kb.super_admin.settings.number) await asst4(bot, admin.telegram_id, text)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {superAdminSettings}
