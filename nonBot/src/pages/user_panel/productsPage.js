const kb = require('../../helpers/keyboard-buttons')
const keyboard = require('../../helpers/keyboard')
const {getProducts, getProduct, updateProduct} = require('../../controllers/productController')
const {getUser, updateUser} = require('../../controllers/userController')
const {uos3} = require('./ordersPage')
const {product_keyboard, determine_the_rating} = require('./../../helpers/utils')

const ups0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Mahsulotlar bo'limida nima qilamiz"
    kbb = keyboard.user.products.uz
  } else if (lang === kb.language.ru) {
    message = "Чем мы занимаемся в отделе продуктов"
    kbb = keyboard.user.products.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ups1 = async (bot, chat_id, lang) => {
  let message, kbb

  const products = await getProducts({status: 'active'})

  if (products.length > 0) {
    await updateUser({telegram_id: chat_id}, {step: 4})
    kbb = product_keyboard(products, lang)
    message = (lang === kb.language.uz) ? "Qaysi mahsulotni tanlaymiz" : "Какой товар мы выбираем?"
  } else {
    kbb = (lang === kb.language.uz) ? keyboard.user.products.uz : keyboard.user.products.ru
    message = (lang === kb.language.uz) ? "Hali mahsulotlar yo'q" : "Товаров пока нет"
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ups2 = async (bot, user, lang, text) => {
  let message = '', clause, iltext

  const product = await getProduct({product_name: text}),
    // rating = determine_the_rating(product),
    add_basket = (lang === kb.language.uz) ? kb.options.product.uz.add_basket : kb.options.product.ru.add_basket

  if (product) {

    if (lang === kb.language.uz) {
      message += `Nomi: ${product.product_name}\n`
      message += `Tavsifi: ${product.description}\n`
      // message += `Reytingi - ${rating}\n`
      message += `Sotilgani - ${product.num_of_sold}\n`
      message += `Narxi: ${product.price}`
    } else if (lang === kb.language.ru) {
      message += `Название: ${product.product_name}\n`
      message += `Описания: ${product.description}\n`
      // message += `Рейтинг - ${rating}\n`
      message += `Продано - ${product.num_of_sold}\n`
      message += `Цена: ${product.price}`
    }

    if (user.liked_products.includes(product._id)) {
      clause = 'REMOVE'
      iltext = (lang === kb.language.uz) ? kb.options.product.uz.remove : kb.options.product.ru.remove
    } else {
      clause = 'ADD'
      iltext = (lang === kb.language.uz) ? kb.options.product.uz.add : kb.options.product.ru.add
    }

    await bot.sendPhoto(user.telegram_id, product.image, {
      caption: message,
      reply_markup: {
        inline_keyboard: [[
          {text: iltext, callback_data: JSON.stringify({phrase: clause, id: product._id})},
          {text: add_basket, callback_data: JSON.stringify({phrase: 'BASKET', id: product._id})}
        ]]
      }
    })
  }
}

const ups3 = async (bot, chat_id, lang) => {
  let message = ''

  const user = await getUser({telegram_id: chat_id}), products = user.liked_products,
    kbb = (lang === kb.language.uz) ? keyboard.user.products.uz : keyboard.user.products.ru

  if (products.length > 0 && user.total_liked_products > 0) {
    for (let i = 0; i < products.length; i++) {
      const product = await getProduct({_id: products[i]})
        // , rating = determine_the_rating(product)

      if (lang === kb.language.uz) {
        message += `Nomi: ${product.product_name}\n`
        message += `Tavsifi: ${product.description}\n`
        // message += `Reytingi - ${rating}\n`
        message += `Sotilgani - ${product.num_of_sold}\n`
        message += `Narxi: ${product.price}`
      } else if (lang === kb.language.ru) {
        message += `Название: ${product.product_name}\n`
        message += `Описания: ${product.description}\n`
        // message += `Рейтинг - ${rating}\n`
        message += `Продано - ${product.num_of_sold}\n`
        message += ` Цена: ${product.price}`
      }

      await bot.sendPhoto(chat_id, product.image, {
        caption: message,
        reply_markup: {resize_keyboard: true, keyboard: kbb}
      })

      message = ''
    }
  } else {
    message = (lang === kb.language.uz) ? "Sizda hali yoqtirgan tovar qo'shilmagan" : "Вы еще не добавили любимый продукт"
    await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
  }
}

const ups4 = async (bot, chat_id, lang, phrase, _id) => {
  let text;
  const
    product = await getProduct({_id}),
    user = await getUser({telegram_id: chat_id}),
    kbb = (lang === kb.language.uz) ? keyboard.user.products.uz : keyboard.user.products.ru

  if (product) {
    if (phrase === 'ADD') {
      if (!user.liked_products.includes(product._id) && !product.liked_users.includes(user._id)) {
        text = (lang === kb.language.uz) ? "Qo'shildi" : "Добавлен"
        user.liked_products.push(product._id)
        user.total_liked_products += 1
        await user.save()

        product.liked_users.push(user._id)
        product.total_liked_users += 1
        await product.save()
      } else {
        text = "Siz allaqachon bu mahsulotni yoqtiranlaringiz qatoriga qo'shib bo'lgansiz"
      }

      await bot.sendMessage(chat_id, text, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
    } else if (phrase === 'BASKET') {
      await updateUser({telegram_id: chat_id}, {step: 3})
      await uos3(bot, chat_id, _id, lang)
    } else if (phrase === 'REMOVE') {
      text = (lang === kb.language.uz) ? "Chiqarildi" : "Вышел"

      const index_user = user.liked_products.indexOf(product._id)
      if (index_user > -1) {
        user.liked_products.splice(index_user)
        user.total_liked_products -= 1
        await user.save()

        const index_product = product.liked_users.indexOf(user._id)

        if (index_product > -1) {
          product.liked_users.splice(index_product)
          product.total_liked_users -= 1
          await product.save()
        }
      }

      await bot.sendMessage(chat_id, text, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
    }
  }
}

const userProduct = async (bot, chat_id, lang, text) => {
  const user = await getUser({telegram_id: chat_id})

  try {
    if (text === kb.user.pages.uz.products || text === kb.user.pages.ru.products) await ups0(bot, chat_id, lang)
    else if (text === kb.user.products.uz.all || text === kb.user.products.ru.all) await ups1(bot, chat_id, lang)
    else if (text === kb.user.products.uz.my || text === kb.user.products.ru.my) await ups3(bot, chat_id, lang)
    else if (text === kb.main.uz || text === kb.main.ru) await updateUser({telegram_id: chat_id}, {step: 3})

    if (user) {
      if (user.step === 4) {
        await ups2(bot, user, lang, text)
      }
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = {userProduct, ups0, ups1, ups4}
