const keyboard = require('../../helpers/keyboard')
const kb = require('../../helpers/keyboard-buttons')
const {genSalt, hash} = require('bcrypt')
const {updateUser} = require('../../controllers/userController')

let type

const ust0 = async (bot, user, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = `Ma'lumotlaringiz: \n Ismingiz - ${user.name}. \n Telefon raqamingiz - ${user.number}. \n Username - ${user.username}. \n Nimani o'zgartirmoqchisiz`
    kbb = keyboard.user.settings.uz
  } else {
    message = `Ваша информация: Ваше имя ${user.name}. Ваш номер телефона: ${user.number}. Что вы хотите изменить`
    kbb = keyboard.user.settings.ru
  }

  await updateUser({telegram_id: user.telegram_id}, {step: 5})

  await bot.sendMessage(user.telegram_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}})
}

const ust1 = async (bot, chat_id, lang) => {
  await updateUser({telegram_id: chat_id}, {step: 6})

  const message = (lang === kb.language.uz)
    ? "O'zgartirmoqchi bo'lgan ismingizni kiriting"
    : "Введите имя, которое хотите изменить"

  await bot.sendMessage(chat_id, message)
}

const ust2 = async (bot, chat_id, lang, text) => {
  let message, kbb

  await updateUser({telegram_id: chat_id}, {name: text, step: 5})

  if (lang === kb.language.uz) {
    message = "Ismingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.user.settings.uz
  } else {
    message = "Ваше имя успешно изменено"
    kbb = keyboard.user.settings.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}})
}

const ust3 = async (bot, chat_id, lang) => {
  await updateUser({telegram_id: chat_id}, {step: 6})

  const message = (lang === kb.language.uz) ? "O'zgartirmoqchi bo'lgan raqamingizni kiriting" : "Введите номер, которое хотите изменить"

  await bot.sendMessage(chat_id, message)
}

const ust4 = async (bot, chat_id, lang, text) => {
  let message, kbb

  await updateUser({telegram_id: chat_id}, {number: text, step: 5})

  if (lang === kb.language.uz) {
    message = "Raqamingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.user.settings.uz
  } else {
    message = "Ваш номер успешно изменен"
    kbb = keyboard.user.settings.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}})
}

const ust5 = async (bot, chat_id, lang) => {
  await updateUser({telegram_id: chat_id}, {step: 6})

  const message = (lang === kb.language.uz) ? "Qaysi tilni tanlaysiz" : "Какой язык вы выбираете"

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: keyboard.language}})
}

const ust6 = async (bot, chat_id, lang, text) => {
  let message, kbb

  await updateUser({telegram_id: chat_id}, {lang: text, step: 5})

  if (lang === kb.language.uz) {
    message = "Tilingiz muvaffaqiyatli o'zgartirildi"
    kbb = keyboard.user.settings.uz
  } else {
    message = "Ваш язык успешно изменен"
    kbb = keyboard.user.settings.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const userSettings = async (bot, user, lang, text) => {
  try {
    if (text === kb.user.pages.uz.settings || text === kb.user.pages.ru.settings) await ust0(bot, user, lang)
    else if ((user.step === 5 || user.step === 6) && (text === kb.main.uz || text === kb.main.ru)) await updateUser({telegram_id: user.telegram_id}, {step: 3})
    else if (user.step === 5) {
      if (text === kb.user.settings.uz.name || text === kb.user.settings.ru.name) await ust1(bot, user.telegram_id, lang)
      else if (text === kb.user.settings.uz.number || text === kb.user.settings.ru.number) await ust3(bot, user.telegram_id, lang)
      else if (text === kb.user.settings.uz.language || text === kb.user.settings.ru.language) await ust5(bot, user.telegram_id, lang)
      type = text
    } else if (user.step === 6) {
      if (type === kb.user.settings.uz.name || type === kb.user.settings.ru.name) await ust2(bot, user.telegram_id, lang, text)
      else if (type === kb.user.settings.uz.number || type === kb.user.settings.ru.number) await ust4(bot, user.telegram_id, lang, text)
      else if (type === kb.user.settings.uz.language || type === kb.user.settings.ru.language) await ust6(bot, user.telegram_id, lang, text)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {userSettings}
