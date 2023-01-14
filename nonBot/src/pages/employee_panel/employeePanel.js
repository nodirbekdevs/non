const {employeeMainPage} = require('./mainPage')
const {employeeSettings} = require('./settingsPage')
const {employeeFeedback} = require('./feedbackPage')
const {employeeProducts} = require('./productsPage')
const {employeeOrders, eos2} = require('./ordersPage')
const {getEmployee, updateEmployee} = require('./../../controllers/employeeController')
const {hash, genSalt} = require('bcrypt')

const employeePanel = async (bot, message, employee) => {
  let text, username = '', password = ''

  const chat_id = message.chat.id, name = employee.name

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
      if (employee.username !== username) {
        const salt = await genSalt()
        password = await hash(username, salt)

        await updateEmployee({telegram_id: chat_id}, {username, password})
      }
    }

    await employeeMainPage(bot, chat_id, text)
    await employeeSettings(bot, employee, text)
    await employeeFeedback(bot, chat_id, name, text)
    await employeeProducts(bot, chat_id, text)
    await employeeOrders(bot, chat_id, text)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeePanel, getEmployee, eos2}
