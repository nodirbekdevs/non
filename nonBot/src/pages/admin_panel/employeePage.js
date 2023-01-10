const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {genSalt, hash} = require('bcrypt')
const {getEmployees, getEmployee, makeEmployee, updateEmployee, countEmployees} = require('./../../controllers/employeeController')

let employee_id;

const aes0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Xodimlar bo'limida nima qilamiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.employee}
  })
}

const aes1 = async (bot, chat_id) => {
  let message
  const employees = await getEmployees({})
  const active_employees = await countEmployees({status: 'active'})

  if (employees.length > 0) {
    employees.map(async item => {
      message = `
      telegram_id - ${item.telegram_id}
      Ismi - ${item.name}
      Username - ${item.username}
      Telefon raqami - ${item.number}
      Vazifasi - ${item.task}
     `
      await bot.sendMessage(chat_id, message)
    })
  } else if (employees.length === 0) {
    message = "Hali xodimlar qo'shilmagan"
    await bot.sendMessage(chat_id, message)
  }

  await bot.sendMessage(chat_id, `Umumiy xodimlar soni ${active_employees}`, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.admin.employee
    }
  })
}

const aes2 = async (bot, chat_id) => {
  const employee = await makeEmployee({admin: chat_id})
  employee_id = employee._id

  await bot.sendMessage(chat_id, "Xodim qo'shishga xush kelibsiz")
  await bot.sendMessage(chat_id, "Xodimni telegram id sini jo'nating", {
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.options.back.uz
    }
  })
}

const aes3 = async (bot, chat_id, _id, text) => {
  await updateEmployee({_id}, {telegram_id: parseInt(text), step: 1})

  await bot.sendMessage(chat_id, "Xodimni usernameni kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aes4 = async (bot, chat_id, _id, text) => {

  const salt = await genSalt()
  const password = await hash(text, salt)

  await updateEmployee({_id}, {username: text, password, step: 2})

  await bot.sendMessage(chat_id, "Xodimni ismini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aes5 = async (bot, chat_id, _id, text) => {

  await updateEmployee({_id}, {name: text, step: 3})

  await bot.sendMessage(chat_id, "Xodimni telefon raqamini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aes6 = async (bot, chat_id, _id, text) => {
  await updateEmployee({_id}, {number: text, step: 4})

  await bot.sendMessage(chat_id, "Xodimni vazifasini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.task}
  })
}

const aes7 = async (bot, chat_id, _id, text) => {
  await updateEmployee({_id}, {task: text, step: 5})

  const employee = await getEmployee({_id})

  const message = `
   telegram_id: ${employee.telegram_id},
   Ismi: ${employee.name},
   Username: ${employee.username},
   Telefon raqami: ${employee.number},
   Vazifasi: ${employee.task}

   "Tugatilganini tasdiqlaysizmi ?"
   `

  await bot.sendMessage(chat_id, message, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.options.confirmation.uz
    }
  })
}

const aes8 = async (bot, chat_id, _id, text) => {
  let message, data
  if (text === kb.options.confirmation.uz) {
    data = {step: 6, status: 'active'}
    message = "Xodim qo'shish muvaffaqiyatli yakunlandi. Xodim qo'shildi"
  }
  if (text === kb.options.not_to_confirmation.uz) {
    data = {step: 7, status: 'inactive'}
    message = "Xodim qo'shish muvaffaqiyatli yakunlanmadi. Xodim qo'shilmadi"
  }


  await updateEmployee({_id}, data)

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.pages}
  })
}

const adminEmployees = async (bot, chat_id, text) => {

  const employee = await getEmployee({_id: employee_id, status: 'process'})
    ? await getEmployee({_id: employee_id, status: 'process'})
    : (await getEmployees({author: chat_id, status: 'process'}))[0]

  if (text === kb.admin.pages.employee) await aes0(bot, chat_id)

  if (text === kb.admin.employee.all) await aes1(bot, chat_id)

  if (text === kb.admin.employee.add) await aes2(bot, chat_id)


  if (employee) {
    if (employee.step === 0) await aes3(bot, chat_id, employee._id, text)

    if (employee.step === 1) await aes4(bot, chat_id, employee._id, text)

    if (employee.step === 2) await aes5(bot, chat_id, employee._id, text)

    if (employee.step === 3) await aes6(bot, chat_id, employee, text)

    if (employee.step === 4) await aes7(bot, chat_id, employee._id, text)

    if (employee.step === 5) await aes8(bot, chat_id, employee._id, text)

    if (text === kb.options.back.uz) {
      await updateEmployee({_id: employee._id}, {step: 6, status: 'inactive'})
      await aes0(bot, chat_id)
    }
  }
}

module.exports = {adminEmployees}
