const keyboard = require('./../../helpers/keyboard')
const kb = require('./../../helpers/keyboard-buttons')
const {getEmployee, updateEmployee} = require('../../controllers/employeeController')
const {bio} = require('./../../helpers/utils')

let type

const esst0 = async (bot, employee) => {
  const message = bio(employee, 'EMPLOYEE', '')

  await updateEmployee({telegram_id: employee.telegram_id}, {step: 1})

  await bot.sendMessage(employee.telegram_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.settings}
  })
}

const esst1 = async (bot, chat_id) => {
  await updateEmployee({telegram_id: chat_id}, {step: 2})
  await bot.sendMessage(chat_id, "O'zgartirmoqchi bo'lgan ismingizni kiriting")
}

const esst2 = async (bot, chat_id, text) => {
  await updateEmployee({telegram_id: chat_id}, {name: text, step: 1})

  const employee = await getEmployee({telegram_id: chat_id}), message = bio(employee, 'EMPLOYEE', '')

  await bot.sendMessage(chat_id, "Ismingiz muvaffaqiyatli o'zgartirildi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.settings}
  })

  await bot.sendMessage(chat_id, message)
}

const esst3 = async (bot, chat_id) => {
  await updateEmployee({telegram_id: chat_id}, {step: 2})
  await bot.sendMessage(chat_id, "O'zgartirmoqchi bo'lgan raqamingizni kiriting")
}

const esst4 = async (bot, chat_id, text) => {
  await updateEmployee({telegram_id: chat_id}, {number: text, step: 1})

  const employee = await getEmployee({telegram_id: chat_id}), message = bio(employee, 'EMPLOYEE', '')

  await bot.sendMessage(chat_id, "Raqamingiz muvaffaqiyatli o'zgartirildi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.settings}
  })

  await bot.sendMessage(chat_id, message)
}

const employeeSettings = async (bot, employee, text) => {
  try {
    if (text === kb.employee.pages.settings) await esst0(bot, employee)
    else if (employee.step === 1 && text === kb.main.uz) await updateEmployee({telegram_id: employee.telegram_id}, {step: 0})
    else if (employee.step === 1) {
      if (text === kb.employee.settings.name) await esst1(bot, employee.telegram_id)
      else if (text === kb.employee.settings.number) await esst3(bot, employee.telegram_id)
      type = text
    } else if (employee.step === 2) {
      if (type === kb.employee.settings.name) await esst2(bot, employee.telegram_id, text)
      else if (type === kb.employee.settings.number) await esst4(bot, employee.telegram_id, text)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeeSettings}
