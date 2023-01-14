const Geo = require('node-geocoder')
const kb = require('../../helpers/keyboard-buttons')
const keyboard = require('../../helpers/keyboard')
const config = require('./../../helpers/config')
const {Calendar} = require('node-calendar-js');
const {getOrders, getOrder, makeOrder, updateOrder, deleteOrder} = require('../../controllers/orderController')
const {getItems, getItem, makeItem, updateItem, deleteItem} = require('./../../controllers/itemController')
const {getProducts, getProduct, updateProduct} = require('./../../controllers/productController')
const {getUser, updateUser} = require('../../controllers/userController')
const {inline_calendar, time_button, product_keyboard, get_report, order_edit_keyboard} = require('./../../helpers/utils')

let item_id, order_id, bread, order

const uos0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Buyurtmalar bo'limida nima qilamiz"
    kbb = keyboard.user.orders.uz
  } else if (lang === kb.language.ru) {
    message = "Чем мы занимаемся в отделе заказов"
    kbb = keyboard.user.orders.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos1 = async (bot, chat_id, lang) => {
  let message

  const orders = await getOrders({author: chat_id}),
    kbb = (lang === kb.language.uz) ? keyboard.user.orders.uz : keyboard.user.orders.ru

  if (orders.length > 0) {
    message = "Buyurtmalaringiz"
    await get_report(orders, lang, 'FULL', {bot: bot, chat_id: chat_id, kbb: kbb})
  } else message = (lang === kb.language.uz) ? "Hali mahsulotlarga buyurtma bermagansiz" : "Вы еще не заказывали товары"

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos2 = async (bot, chat_id, lang) => {
  let message = "Qabul qilib olishingiz kerak bo'lgan buyurtmalar"

  const orders = await getOrders({author: chat_id, should_deliver: false, status: 'active'}), text = "RECEIVE",
    kbb = (lang === kb.language.uz) ? keyboard.user.orders.uz : keyboard.user.orders.ru

  if (orders.length > 0) await get_report(orders, lang, 'ONE_RC', {bot, chat_id, text})
  else message = (lang === kb.language.uz) ? "Hali mahsulotlarga buyurtma bermagansiz" : "Вы еще не заказывали товары"

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos3 = async (bot, chat_id, _id, lang) => {
  let message, kbb, item

  const product = await getProduct({_id}), order = (await getOrders({author: chat_id, status: 'process'}))[0]

  if (order) {
    const items = order.items

    if (items.length !== 0 && order.total_items !== 0) {
      for (let i = 0; i < items.length; i++) {
        item = await getItem({_id: items[i], order: order._id, product: product.product_name, step: 1, status: 'active'})
      }
    }
  }

  if (item) await updateItem({_id: item._id}, {step: 0, status: 'process'})
  else if (!item) item = await makeItem(chat_id, product.product_name)

  if (lang === kb.language.uz) {
    message = `${product.product_name} dan nechta buyurtma berasiz`
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = `Сколько ${product.product_name} вы заказываете?`
    kbb = keyboard.options.back.ru
  }

  item_id = item._id

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos4 = async (bot, chat_id, item, order, lang, text) => {
  const product = await getProduct({product_name: item.product}), price = parseInt(text) * product.price

  const products = await getProducts({status: 'active'}), Order = order ? order : await makeOrder(chat_id)

  if (!order) order_id = Order._id

  const existOrder = await getOrder({_id: Order._id})

  if (!existOrder.items.includes(item._id)) {
    existOrder.items.push(item._id)
    existOrder.total_items += 1
  }

  existOrder.price += price
  await existOrder.save()

  if (item) {
    item.order = Order._id
    item.quantity += parseInt(text)
    item.price += price
    item.step = 1
    item.status = 'active'
    await item.save()
  }

  await updateUser({telegram_id: chat_id}, {step: 4})

  const kbb = product_keyboard(products, lang),
    message = (lang === kb.language.uz) ? "Qaysi mahsulotni tanlaymiz" : "Какой товар мы выбираем?"

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos5 = async (bot, chat_id, order, lang) => {
  let message, kbb

  if (order && (order.items.length !== 0 && order.total_items !== 0)) {
    message = await get_report(order, lang, 'BK')

    kbb = (lang === kb.language.uz) ? keyboard.options.order.uz : keyboard.options.order.ru

    await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
  } else if (!order || (order.items.length === 0 && order.total_items === 0)) {

    if (lang === kb.language.uz) {
      message = "Sizning savatiniz bo'sh"
      kbb = keyboard.user.products.uz
    } else if (lang === kb.language.ru) {
      message = "Ваша корзина пуста"
      kbb = keyboard.user.products.ru
    }

    await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
  }
}

const uos6 = async (bot, chat_id, _id, lang) => {
  const order = await getOrder({_id}),
    message = (lang === kb.language.uz) ? "Mahsulotlaringiz" : "Ваши продукты",
    kbb = await order_edit_keyboard(order, lang)

  await updateOrder({_id}, {step: 1})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos7 = async (bot, chat_id, _id, lang, text) => {
  let message, kbb
  bread = text.split("-")[0]

  await updateOrder({_id}, {step: 2})

  const order = await getOrder({_id}), items = order.items

  for (let i = 0; i < items.length; i++) {
    await updateItem({
      _id: items[i],
      author: chat_id,
      order: order._id,
      product: bread,
      step: 1,
      status: 'active'
    }, {step: 2})
  }

  if (lang === kb.language.uz) {
    message = `${bread} ga yana qo'shamizmi yoki ayiramizmi ?`
    kbb = keyboard.options.situation.uz
  } else if (lang === kb.language.ru) {
    message = `Прибавить или вычесть из ${bread} еще ?`
    kbb = keyboard.options.situation.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos8 = async (bot, chat_id, _id, lang, text) => {
  let message, product,
    kbb = (lang === kb.language.uz) ? keyboard.options.back.uz : keyboard.options.back.ru

  await updateOrder({_id}, {step: 3})

  const order = await getOrder({_id}), items = order.items

  for (let i = 0; i < items.length; i++) {
    const item = await getItem({_id: items[i], step: 2})

    if (item) {
      item.situation = text
      await item.save()

      product = item.product
    }
  }

  if (text !== kb.options.situation.uz.destroy && text !== kb.options.situation.ru.destroy) {
    if (text === kb.options.situation.uz.increase || text === kb.options.situation.ru.increase) {
      message = (lang === kb.language.uz) ? `${product} ga nechta qo'shamiz ?` : `Сколько мы добавляем к ${product} ?`
    } else if (text === kb.options.situation.uz.decrease || text === kb.options.situation.ru.decrease) {
      message = (lang === kb.language.uz) ? `${product} dan nechta ayiramiz ?` : `Сколько мы вычитаем из ${product}?`
    }
  } else {
    if (lang === kb.language.uz) {
      message = `${product} ni olib tashlaymizmi?`
      kbb = keyboard.options.allow.uz
    } else if (lang === kb.language.ru) {
      message = `Отмена ${product}?`
      kbb = keyboard.options.allow.ru
    }
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos9 = async (bot, chat_id, _id, lang, text) => {
  let message, item_id, order = await getOrder({_id})

  const items = order.items

  for (let i = 0; i < items.length; i++) {
    let product_price, quantity, price
    const item = await getItem({_id: items[i], step: 2})

    if (item) {
      product_price = item.price / item.quantity
      quantity = parseInt(text)
      if (quantity < 0) quantity *= -1
      item_id = item._id

      if (item.situation === kb.options.situation.uz.increase || item.situation === kb.options.situation.ru.increase) {
        price = quantity * product_price
        message = (lang === kb.language.uz) ? "Mahsulot qo'shildi" : "Продукта добавлена"

        await updateItem({_id: item._id}, {$inc: {quantity: quantity, price: price}})
        await updateOrder({_id}, {$inc: {price: price}})
      } else if (item.situation === kb.options.situation.uz.decrease || item.situation === kb.options.situation.ru.decrease) {
        if (item.quantity > quantity) {
          price = quantity * product_price

          message = (lang === kb.language.uz) ? "Mahsulot ayirildi" : "Продукт удален"

          await updateItem({_id: item._id}, {$inc: {quantity: -quantity, price: -price}})
          await updateOrder({_id}, {$inc: {price: -price}})

        } else if (item.quantity < quantity) {

          message = (lang === kb.language.uz)
            ? `Sizda ${quantity} ta ${item.product} yo'q`
            : `У вас нет ${quantity} из ${item.product}`

        } else if (item.quantity === quantity) {
          const index = order.items.indexOf(item._id)

          if (index > -1) {
            order.items.splice(index, 1)
            order.total_items -= 1
            order.price -= item.price
            await order.save()

            await deleteItem({_id: item._id})
            item_id = ""

            if (order.items.length === 0 && order.total_items === 0) {
              await deleteOrder({_id: order._id})
            }
          }

          if (order) {
            message = (lang === kb.language.uz)
              ? `${item.product} dan ${quantity} ta ayirildi` : `${quantity} было вычтено из ${item.product}`
          } else {
            message = (lang === kb.language.uz) ? "Savatingiz tozalandi" : "Ваша корзина очищена"
          }
        }
      } else if (item.situation === kb.options.situation.uz.destroy || item.situation === kb.options.situation.ru.destroy) {
        if (text === kb.options.allow.uz.yes || text === kb.options.allow.ru.yes) {
          const index = order.items.indexOf(item._id)

          if (index > -1) {
            order.items.splice(index, 1)
            order.total_items -= 1
            order.price -= item.price
            await order.save()

            await deleteItem({_id: item._id})
            item_id = ""

            if (order.items.length === 0 && order.total_items === 0) {
              await deleteOrder({_id: order._id})
            }
          }

          if (order) {
            message = (lang === kb.language.uz)
              ? `${item.product} olib tashlandi`
              : `${item.product} удален`
          } else {
            message = (lang === kb.language.uz) ? "Savatingiz tozalandi" : "Ваша корзина очищена"
          }

        } else if (text === kb.options.allow.uz.no || text === kb.options.allow.ru.no) {
          message = (lang === kb.language.uz)
            ? `${item.product}ni olib tashlash bekor qilindi`
            : `Не удалось удалить ${item.product}`
        }
      }
    }

    if (item_id !== "") {
      await updateItem({_id: item_id}, {step: 1, situation: ''})
    }

    await updateOrder({_id}, {step: 0})
  }

  order = await getOrder({_id})

  await bot.sendMessage(chat_id, message)

  await uos5(bot, chat_id, order, lang)
}

const uos10 = async (bot, chat_id, _id, lang, text) => {
  const order = await getOrder({_id}), message = await get_report(order, lang, 'BK'),
    kbb = (lang === kb.language.uz) ? keyboard.options.order.uz : keyboard.options.order.ru, items = order.items

  if (text === kb.options.back.uz || text === kb.options.back.ru) {
    if (order.step === 1) {
      await updateOrder({_id}, {step: 0})

      await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
    }
    if (order.step === 2) {
      await updateOrder({_id}, {step: 0})

      for (let i = 0; i < items.length; i++) {
        await updateItem({_id: items[i], step: 2}, {step: 1})
      }

      await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
    }
    if (order.step === 3) {
      await updateOrder({_id}, {step: 0})

      for (let i = 0; i < items.length; i++) {
        await updateItem({_id: items[i], step: 2}, {step: 1, situation: ''})
      }

      await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
    }
  }
}

const uos11 = async (bot, chat_id, _id, lang) => {
  let message, kbb

  const order = await getOrder({_id}), items = order.items

  for (let i = 0; i < items.length; i++) {
    await deleteItem({_id: items[i]})
  }

  await deleteOrder({_id})

  const send_message = (lang === kb.language.uz) ? "Savatingiz tozalandi" : "Ваша корзина очищена"

  if (lang === kb.language.uz) {
    message = "Mahsulotlar bo'limida nima qilamiz"
    kbb = keyboard.user.products.uz
  } else if (lang === kb.language.ru) {
    message = "Чем мы занимаемся в отделе продуктов"
    kbb = keyboard.user.products.ru
  }

  await bot.sendMessage(chat_id, send_message)

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos12 = async (bot, chat_id, _id, lang) => {
  await updateOrder({_id}, {step: 4})

  const message = (lang === kb.language.uz) ? 'Qaysi kunga kerak?' : 'В какой день он вам нужен?'

  const date = new Date(), current_date = date.getDate(), month = date.getMonth(), year = date.getFullYear(),
    cal = inline_calendar(year, month, current_date);

  await bot.sendMessage(chat_id, message, {reply_markup: {inline_keyboard: cal}})
}

const uos13 = async (bot, chat_id, _id, lang, text) => {
  await updateOrder({_id}, {date: text, step: 5})

  const message = (lang === kb.language.uz) ? "Qaysi vaqtga kerak?" : "Какое время вам нужно?",
    time = time_button(kb.options.time_values)

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: time}})
}

const uos14 = async (bot, chat_id, _id, lang, text) => {
  let message, kbb

  await updateOrder({_id}, {time: text, step: 6})

  if (lang === kb.language.uz) {
    message = "Yetkazib berish kerakmi?"
    kbb = keyboard.options.allow.uz
  } else if (lang === kb.language.ru) {
    message = "Вам нужна доставка?"
    kbb = keyboard.options.allow.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos15 = async (bot, chat_id, _id, lang) => {
  let message, kbb

  await updateOrder({_id}, {should_deliver: true, attempt: 1})

  if (lang === kb.language.uz) {
    message = `Lokatsiyagizni ${kb.options.send.uz} tugmasini bosib jo'nating, sizga yetkazib berishimiz uchun. Iltimos telefoningizni lokatsiyasini yoqib qo'ying.`
    kbb = [[{text: kb.options.send.uz, request_location: true}]]
  } else if (lang === kb.language.ru) {
    message = `Отправьте свое местоположение, нажав кнопку ${kb.options.send.ru}, чтобы мы могли доставить его вам. Пожалуйста, включите местоположение вашего телефона.`
    kbb = [[{text: kb.options.send.ru, request_location: true}]]
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}
  })
}

const uos16 = async (bot, chat_id, _id, lang, text) => {
  let message, order = await getOrder({_id}), place_name = ''

  const geo = Geo(config.MAP_OPTIONS), place_geo = await geo.reverse({lat: text.latitude, lon: text.longitude}),
    kbb = (lang === kb.language.uz) ? keyboard.options.confirmation.uz : keyboard.options.confirmation.ru

  place_geo.map(place => place_name = `${place.country} ${place.city} ${place.county}`)

  order.location.place_name = place_name
  order.location.latitude = text.latitude
  order.location.longitude = text.longitude
  order.step = 7
  await order.save()

  order = await getOrder({_id})

  if (order) message = await get_report(order, lang, 'SHD')

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos17 = async (bot, chat_id, _id, lang) => {
  let total_price = 0, message, order = await getOrder({_id})

  const items = order.items,
    kbb = (lang === kb.language.uz) ? keyboard.options.confirmation.uz : keyboard.options.confirmation.ru

  for (let i = 0; i < items.length; i++) {
    const item = await getItem({_id: items[i]})

    total_price += item.price
  }
  await updateOrder({_id: order._id}, {price: total_price, step: 7})

  order = await getOrder({_id})

  message = await get_report(order, lang, 'ONE_SHND')

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos18 = async (bot, chat_id, _id, lang, text) => {
  let message
  const kbb = (lang === kb.language.uz) ? keyboard.user.orders.uz : keyboard.user.orders.ru

  if (text === kb.options.confirmation.uz || text === kb.options.confirmation.ru) {
    await updateOrder({_id}, {step: 8, status: 'active'})

    const order = await getOrder({_id}), user = await getUser({telegram_id: chat_id}), items = order.items
    let report = await get_report(order, lang, 'ONE')

    for (let i = 0; i < items.length; i++) {
      await updateItem({_id: items[i]}, {step: 3, status: 'ordered'})
    }

    if (user) {
      user.orders.push(order._id)
      user.total_orders += 1
      await user.save()
    }

    report += '\n\nYangi buyurtma berildi'

    await bot.sendMessage(order.admin, report)

    message = (lang === kb.language.uz) ? "Buyurtmangiz qabul qilindi" : "Ваш заказ принят"
  } else if (text === kb.options.not_to_confirmation.uz || text === kb.options.not_to_confirmation.ru) {
    const order = await getOrder({_id}), items = order.items

    for (let i = 0; i < items.length; i++) {
      await deleteItem({_id: items[i]})
    }

    await deleteOrder({_id})

    message = (lang === kb.language.uz) ? "Buyurtmangiz qabul qilinmadi" : "Ваш заказ не принят"
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uos19 = async (bot, chat_id, lang, _id) => {
  let message
  const kbb = (lang === kb.language.uz) ? keyboard.user.orders.uz : keyboard.user.orders.ru, order = await getOrder({_id})

  if (order.status === 'active') {
    await updateOrder({_id}, {step: 13, attempt: 2, status: 'accepted'})

    const items = order.items

    for (let i = 0; i < items.length; i++) {
      const item = await getItem({_id: items[i]})

      await updateItem({_id: items[i]}, {step: 6, status: 'accepted'})
      await updateProduct({name: item.product}, {$inc: {num_of_sold: item.quantity}})
      await updateUser({telegram_id: chat_id}, {$inc: {num_of_bought: item.quantity}})
    }

    message = (lang === kb.language.uz) ? "Buyurtmangizni qabul qilib olganingizdan xursandmiz!" : "Мы рады, что вы получили свой заказ!"
  } else if (order.status === 'accepted') {
    message = (lang === kb.language.uz) ? "Siz bu buyurtmani qabul qilib olgansiz" : "Вы приняли этот заказ"
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const userOrder = async (bot, chat_id, lang, text) => {
  const item = await getItem({_id: item_id, author: chat_id, status: 'process'})
    ? await getItem({_id: item_id, author: chat_id, status: 'process'})
    : (await getItems({author: chat_id, status: 'process'}))[0]

  order = await getOrder({_id: order_id, author: chat_id, status: 'process'})
    ? await getOrder({_id: order_id, author: chat_id, status: 'process'})
    : (await getOrders({author: chat_id, status: 'process'}))[0]

  try {
    if (text === kb.user.pages.uz.orders || text === kb.user.pages.ru.orders) await uos0(bot, chat_id, lang)
    if (text === kb.user.orders.uz.my_orders || text === kb.user.orders.ru.my_orders) await uos1(bot, chat_id, lang)
    if (text === kb.user.orders.uz.should_accept || text === kb.user.orders.ru.should_accept) await uos2(bot, chat_id, lang)
    if (
      (text === kb.user.pages.uz.basket || text === kb.user.pages.ru.basket) ||
      (text === kb.options.basket.uz || text === kb.options.basket.ru)
    ) await uos5(bot, chat_id, order, lang)

    if (item) await uos4(bot, chat_id, item, order, lang, text)

    if (order) {
      if (
        (order.step === 1 || order.step === 2 || order.step === 3) &&
        (text === kb.options.back.uz || text === kb.options.back.ru)
      ) {
        await uos10(bot, chat_id, order._id, lang, text)
      }

      order = await getOrder({_id: order_id, author: chat_id, status: 'process'})
        ? await getOrder({_id: order_id, author: chat_id, status: 'process'})
        : (await getOrders({author: chat_id, status: 'process'}))[0]

      if (text === kb.options.order.uz.edit || text === kb.options.order.ru.edit) await uos6(bot, chat_id, order._id, lang)
      if (text === kb.options.order.uz.clear || text === kb.options.order.ru.clear) await uos11(bot, chat_id, order._id, lang)
      if (text === kb.options.order.uz.order || text === kb.options.order.ru.order) await uos12(bot, chat_id, order._id, lang)

      if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
        if (order.step === 1) await uos7(bot, chat_id, order._id, lang, text)
        if (order.step === 2) await uos8(bot, chat_id, order._id, lang, text)
        if (order.step === 3) await uos9(bot, chat_id, order._id, lang, text)
      }

      if (order.step === 4) await uos13(bot, chat_id, order._id, lang, text)
      if (order.step === 5) await uos14(bot, chat_id, order._id, lang, text)
      if (order.step === 6 && (text === kb.options.allow.uz.yes || text === kb.options.allow.ru.yes)) await uos15(bot, chat_id, order._id, lang)
      if (order.step === 6 && order.attempt === 1) await uos16(bot, chat_id, order._id, lang, text)
      if (order.step === 6 && (text === kb.options.allow.uz.no || text === kb.options.allow.ru.no)) await uos17(bot, chat_id, order._id, lang)
      if (order.step === 7) await uos18(bot, chat_id, order._id, lang, text)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {userOrder, uos3, uos13, uos19}
