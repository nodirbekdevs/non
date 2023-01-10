const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getProducts, getProduct, makeProduct, updateProduct, countProduct} = require('./../../controllers/productController')

let product_id;

const aps0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Mahsulotlar bo'limida nima qilamiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.products}
  })
}

const aps1 = async (bot, chat_id) => {
  let message
  const products = await getProducts({})
  const active_products = await countProduct({status: 'active'})

  if (products.length > 0) {
    products.map(async item => {
      message = `
      author - ${item.author}
      name - ${item.product_name}
      description - ${item.description}
      num_of_sold - ${item.num_of_sold}
      price - ${item.price}
      status - ${item.status}
    `

      await bot.sendPhoto(chat_id, item.image, {
        caption: message, reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.products}
      })
    })
  } else if (products.length === 0) {
    message = "Hali mahsulotlar qo'shilmagan"
    await bot.sendMessage(chat_id, message, {
      reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.products}
    })
  }

  await bot.sendMessage(chat_id, `Umumiy mahsulotlar soni ${active_products}`, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.products}
  })
}

const aps2 = async (bot, chat_id) => {
  const product = await makeProduct(chat_id)
  product_id = product._id

  await bot.sendMessage(chat_id, "Mahsulot joylashga hush kelibsiz")

  await bot.sendMessage(chat_id, "Mahsulotni rasmini jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aps3 = async (bot, chat_id, _id, text) => {
  await updateProduct({_id}, {image: text, step: 1})

  await bot.sendMessage(chat_id, "Mahsulotni nomini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aps4 = async (bot, chat_id, _id, text) => {
  await updateProduct({_id}, {product_name: text, step: 2})

  await bot.sendMessage(chat_id, "Mahsulotni tavsifini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aps5 = async (bot, chat_id, _id, text) => {
  await updateProduct({_id}, {description: text, step: 3})

  await bot.sendMessage(chat_id, "Mahsulotni narxini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aps6 = async (bot, chat_id, _id, text) => {
  await updateProduct({_id}, {price: parseInt(text), step: 4})

  const product = await getProduct({_id})

  const message = `
   author: ${product.author},
   name: ${product.product_name},
   description: ${product.description},
   raing: 0,
   num_of_sold: ${product.num_of_sold},
   price: ${product.price}

   "Tugatilganini tasdiqlaysizmi ?"
   `

  await bot.sendPhoto(chat_id, product.image, {
    caption: message,
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.options.confirmation.uz
    }
  })
}

const aps7 = async (bot, chat_id, _id, text) => {
  let message
  if (text === kb.options.confirmation.uz) {
    await updateProduct({_id}, {step: 5, status: 'active'})
    message = "Mahsulot qo'shish muvaffaqiyatli yakunlandi. Mahsulot qo'shildi"
  }
  if (text === kb.options.not_to_confirmation.uz) {
    await updateProduct({_id}, {step: 6, status: 'inactive'})
    message = "Mahsulot qo'shish muvaffaqiyatli yakunlanmadi. Mahsulot qo'shilmadi"
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.pages}
  })
}

const adminProducts = async (bot, chat_id, text) => {
  const product = await getProduct({_id: product_id, status: 'process'})
    ? await getProduct({_id: product_id, status: 'process'})
    : (await getProducts({author: chat_id, status: 'process'}))[0]

  if (text === kb.admin.pages.products) await aps0(bot, chat_id)

  if (text === kb.admin.products.all) await aps1(bot, chat_id)

  if (text === kb.admin.products.add) await aps2(bot, chat_id)

  if (product) {
    if (text === kb.options.back.uz) {
      await updateProduct({_id: product._id}, {step: 6, status: 'inactive'})
      await aps0(bot, chat_id)
    } else if (text !== kb.options.back.uz) {
      if (product.step === 0) await aps3(bot, chat_id, product._id, text)

      if (product.step === 1) await aps4(bot, chat_id, product._id, text)

      if (product.step === 2) await aps5(bot, chat_id, product._id, text)

      if (product.step === 3) await aps6(bot, chat_id, product, text)

      if (product.step === 4) await aps7(bot, chat_id, product._id, text)
    }

  }
}

module.exports = {adminProducts}
