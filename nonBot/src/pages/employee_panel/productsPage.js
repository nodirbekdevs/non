const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getProducts} = require('./../../controllers/productController')

const ps0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Mahsulotlar bo'limida nima qilamiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.products}
  })
}

const ps1 = async (bot, chat_id) => {
  let message = ''

  const products = await getProducts({}), kbb = keyboard.employee.products

  if (products.length > 0) {
    for (let i = 0; i < products.length; i++) {
      const product = products[i]

      message += `Nomi: ${product.product_name}\n`
      message += `Tavsifi: ${product.description}\n`
      message += `Narxi: ${product.price}`

      await bot.sendPhoto(chat_id, product.image, {
        caption: message, reply_markup: {resize_keyboard: true, keyboard: kbb}
      })

      message = ""
    }
  } else {
    await bot.sendMessage(chat_id, "Hali mahsulotlar yo'q", {
      reply_markup: {resize_keyboard: true, keyboard: kbb}
    })
  }
}

const employeeProducts = async (bot, chat_id, text) => {
  try {
    if (text === kb.employee.pages.products) await ps0(bot, chat_id)
    else if (text === kb.employee.products.all) await ps1(bot, chat_id)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeeProducts}
