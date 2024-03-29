const kb = require('./keyboard-buttons')
const {getItem} = require('./../controllers/itemController')

const getNumDayOfWeek = (date) => {
  const day = date.getDay();
  return (day === 0) ? 6 : day - 1;
}

const getDays = (year, month) => {
  let d = new Date(year, month);
  console.log(d)
  let days = [];
  days[days.length] = [];
  for (let i = 0; i < getNumDayOfWeek(d); i++) {
    days[days.length - 1].push("-");
  }
  while (d.getMonth() === +month) {
    days[days.length - 1].push(d.getDate());
    if (getNumDayOfWeek(d) % 7 === 6) {
      days[days.length] = [];
    }
    d.setDate(d.getDate() + 1);
  }

  if (getNumDayOfWeek(d) !== 0) {
    for (let i = getNumDayOfWeek(d); i < 7; i++) {
      days[days.length - 1].push("-");
    }
  }
  return days;
}

const setBeforeZero = (num) => {
  return ("0" + (num)).slice(-2);
}

const calendar_keyboard = (dayLines, current_info, current_date) => {
  let buttons = [], cd

  buttons.push([
    {
      text: current_info,
      callback_data: "info_" + current_info
    }
  ]);

  dayLines.map(line => {
    buttons[buttons.length] = [];
    line.map(day => {

      cd = (day !== current_date && day > current_date) ? day : '-'

      buttons[buttons.length - 1].push({
        text: cd,
        callback_data: cd > 0
          ? JSON.stringify({phrase: kb.options.day.uz, id: setBeforeZero(cd) + "-" + current_info})
          : JSON.stringify({phrase: "inline", id: "none"})
      });
    });
  });

  return buttons
}

const inline_calendar = (year, month, current_date) => {
  let new_year, new_month, dayLines, currentMonthDate, current_info, buttons

  dayLines = getDays(year, month)
  currentMonthDate = new Date(+year, +month)
  current_info = setBeforeZero(currentMonthDate.getMonth() + 1) + "-" + currentMonthDate.getFullYear();

  buttons = calendar_keyboard(dayLines, current_info, current_date)

  console.log(buttons)

  const last_line = buttons[buttons.length - 1]

  console.log(last_line)

  if (
    last_line[0].text === "-" && last_line[1].text === "-" && last_line[2].text === "-" && last_line[3].text === "-" &&
    last_line[4].text === "-" && last_line[5].text === "-" && last_line[6].text === "-"
  ) {
    new_year = year
    new_month = month + 1

    if (month === 12) {
      new_year = year + 1
      new_month = 1
    }
    console.log(new_year, new_month)


    currentMonthDate = new Date(new_year, new_month)

    new_year = currentMonthDate.getFullYear()
    new_month = currentMonthDate.getMonth()

    dayLines = getDays(new_year, new_month)
    current_info = setBeforeZero(currentMonthDate.getMonth() + 1) + "-" + currentMonthDate.getFullYear();

    buttons = calendar_keyboard(dayLines, current_info, current_date)
  }

  return buttons
}

const time_button = (object) => {
  const time = object
  let time_buttons = [[], [], []]
  for (let i in time) {
    const btn = parseInt(i)
    if (btn >= 6 && btn <= 9) {
      time_buttons[0].push(time[i])
    } else if (btn >= 10 && btn <= 13) {
      time_buttons[1].push(time[i])
    } else if (btn >= 14 && btn <= 17) {
      time_buttons[2].push(time[i])
    }
  }

  return time_buttons
}

const product_keyboard = (data, lang) => {
  let kbb = [], arr = []

  data.forEach(item => {
    const obj = {text: item.product_name}
    arr.push(obj)

    if (arr.length % 2 === 0) {
      kbb.push(arr)
      arr = []
    }
  })

  if (data.length % 2 === 1) {
    kbb.push([{text: data[data.length - 1].product_name}])
  }

  if (lang === kb.language.uz) kbb.push([kb.options.basket.uz, kb.main.uz])
  else kbb.push([kb.options.basket.ru, kb.main.ru])


  return kbb
}

const order_edit_keyboard = async (data, lang) => {
  let kbb = [], arr = []

  const items = data.items

  for (let i = 0; i < items.length; i++) {
    const item = await getItem({_id: items[i]})

    const obj = {text: `${item.product}-${item.quantity}`}
    arr.push(obj)

    if (arr.length % 2 === 0) {
      kbb.push(arr)
      arr = []
    }
  }

  if (arr.length % 2 === 1) {
    kbb.push(arr)
  }

  (lang === kb.language.uz) ? kbb.push([kb.options.back.uz]) : kbb.push([kb.options.back.ru])

  return kbb
}

const determine_the_rating = (product) => {
  let rating = 0

  if (product.rating.length > 0) {
    let total_rating = 0

    for (let i = 0; i < product.rating; i++) {
      total_rating += product.rating[i]
    }

    rating = total_rating / product.rating.length
  }

  return rating
}

const bio = (data, kw, lang) => {
  let message = ''

  if (kw === 'ADMIN') {
    message += 'Ma\'lumotlaringiz: \n'
    message += `Ismingiz - ${data.name}.\n`
    message += `Telefon raqamingiz - ${data.number}.\n`
    message += `\nNimani o'zgartirmoqchisiz`
  } else if (kw === 'EMPLOYEE') {
    message += `Ma'lumotlaringiz: \n`
    message += `Ismingiz - ${data.name}.\n`
    message += `Telefon raqamingiz - ${data.number}\n`
    message += `\n Nimani o'zgartirmoqchisiz`
  } else if (kw === 'USER') {
    if (lang === kb.language.uz) {
      message += `Ma'lumotlaringiz:\n`
      message += `Ismingiz - ${data.name}.\n`
      message += `Telefon raqamingiz - +${data.number}.\n`
      message += 'Tanlagan tilingiz - UZ\n'
      message += '\nNimani o\'zgartirmoqchisiz'
    } else if (lang === kb.language.ru) {
      message += `Ma'lumotlaringiz:\n`
      message += `Ваше имя - ${data.name}.\n`
      message += `Ваш номер телефона - +${data.number}.\n`
      message += 'Выбранный вами язык - RU\n'
      message += '\nЧто вы хотите изменить'
    }
  }

  return message
}

const get_report = async (data, lang, kw, options = null) => {
  let report = "", information = '', bot, chat_id, kbb, text, clause = '', items, total_sum = 0

  if (typeof data === 'object') items = data.items

  if (data.status === 'process' && data.items.length > 0) {
    report = (lang === kb.language.uz) ? "Buyurtma qilmoqchi bo'lgan mahsulotlaringiz\n" : "Продукты, которые вы хотите заказать\n"
  }

  if (options) {
    bot = options.bot ? options.bot : null
    chat_id = options.chat_id ? options.chat_id : null
    kbb = options.kbb ? options.kbb : null
    text = options.text ? options.text : null
  }

  if (kw === 'FULL') {
    for (let i = 0; i < data.length; i++) {
      const order = data[i]

      if (order.status !== 'inactive' && order.status !== 'process') {
        const items = order.items

        for (let i = 0; i < items.length; i++) {
          const item = await getItem({_id: items[i]})

          if (lang === kb.language.uz) {
            clause += `\nMahsulot nomi: ${item.product}\n`
            clause += `Miqdori: ${item.quantity}\n`
            clause += `Narxi: ${item.price}\n`
          } else {
            clause += `\nТовар: ${item.product}\n`
            clause += `Число: ${item.quantity}\n`
            clause += `Цена: ${item.price}\n`
          }

          report += clause

          clause = ""
        }

        if (order.should_deliver) {
          if (lang === kb.language.uz) {
            information += `\nMahsulot turi: ${order.total_items}\n`
            information += `Yetkazib berish: Mavjud\n`
            information += `Yetkazib berish manzili: ${order.location.place_name}\n`
            information += `Kuni: ${order.date}\n`
            information += `Vaqti: ${order.time}\n`
            information += `Narxi: ${order.price}\n`
            information += `Holati: ${order.status}`
          } else if (lang === kb.language.ru) {
            information += `\nТип продукта: ${order.total_items}\n`
            information += `Доставка: Есть\n`
            information += `Адреса доставки: ${order.location.place_name}\n`
            information += `День: ${order.date}\n`
            information += `Время: ${order.time}\n`
            information += `Цена: ${order.price}\n`
            information += `Статус: ${order.status}`
          }
        } else if (!order.should_deliver) {
          if (lang === kb.language.uz) {
            information += `\nMahsulot turi: ${order.total_items}\n`
            information += `Yetkazib berish: Mavjud emas\n`
            information += `Kuni: ${order.date}\n`
            information += `Vaqti: ${order.time}\n`
            information += `Narxi: ${order.price}\n`
            information += `Holati: ${order.status}`
          } else if (lang === kb.language.ru) {
            information += `\nТип продукта: ${order.total_items}\n`
            information += `Доставка: Недоступно\n`
            information += `День: ${order.date}\n`
            information += `Время: ${order.time}\n`
            information += `Цена: ${order.price}\n`
            information += `Статус: ${order.status}`
          }
        }

        report += information

        information = ''

        await bot.sendMessage(chat_id, report, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

        report = ""
      }
    }
  }

  if (kw === 'ONE') {
    for (let i = 0; i < items.length; i++) {
      const item = await getItem({_id: items[i]})

      if (lang === kb.language.uz) {
        clause += `\nMahsulot nomi: ${item.product}\n`
        clause += `Miqdori: ${item.quantity}\n`
        clause += `Narxi: ${item.price}\n`
      } else {
        clause += `\nТовар: ${item.product}\n`
        clause += `Число: ${item.quantity}\n`
        clause += `Цена: ${item.price}\n`
      }

      report += clause

      clause = ""
    }

    if (data.should_deliver) {
      if (lang === kb.language.uz) {
        information += `\nMahsulot turi: ${data.total_items}\n`
        information += `Yetkazib berish: Mavjud\n`
        information += `Yetkazib berish manzili: ${data.location.place_name}\n`
        information += `Kuni: ${data.date}\n`
        information += `Vaqti: ${data.time}\n`
        information += `Narxi: ${data.price}\n`
        information += `Holati: ${data.status}`
      } else if (lang === kb.language.ru) {
        information += `\nТип продукта: ${data.total_items}\n`
        information += `Доставка: Есть\n`
        information += `Адреса доставки: ${data.location.place_name}\n`
        information += `День: ${data.date}\n`
        information += `Время: ${data.time}\n`
        information += `Цена: ${data.price}\n`
        information += `Статус: ${data.status}`
      }
    } else if (!data.should_deliver) {
      if (lang === kb.language.uz) {
        information += `\nMahsulot turi: ${data.total_items}\n`
        information += `Yetkazib berish: Mavjud emas\n`
        information += `Kuni: ${data.date}\n`
        information += `Vaqti: ${data.time}\n`
        information += `Narxi: ${data.price}\n`
        information += `Holati: ${data.status}`
      } else if (lang === kb.language.ru) {
        information += `\nТип продукта: ${data.total_items}\n`
        information += `Доставка: Недоступно\n`
        information += `День: ${data.date}\n`
        information += `Время: ${data.time}\n`
        information += `Цена: ${data.price}\n`
        information += `Статус: ${data.status}`
      }
    }
    report += information

    information = null

    return report
  }

  if (kw === 'ONE_RC') {
    for (let i = 0; i < data.length; i++) {
      const order = data[i], items = order.items

      for (let i = 0; i < items.length; i++) {
        const item = await getItem({_id: items[i]})

        if (lang === kb.language.uz) {
          clause += `\nMahsulot nomi: ${item.product}\n`
          clause += `Miqdori: ${item.quantity}\n`
          clause += `Narxi: ${item.price}\n`
        } else {
          clause += `\nТовар: ${item.product}\n`
          clause += `Число: ${item.quantity}\n`
          clause += `Цена: ${item.price}\n`
        }

        report += clause

        clause = ""
      }

      if (lang === kb.language.uz) {
        information += `\nMahsulot turi: ${order.total_items}\n`
        information += `Yetkazib berish: Mavjud emas\n`
        information += `Kuni: ${order.date}\n`
        information += `Vaqti: ${order.time}\n`
        information += `Narxi: ${order.price}\n`
        information += `Holati: ${order.status}`
      } else if (lang === kb.language.ru) {
        information += `\nТип продукта: ${order.total_items}\n`
        information += `Доставка: Недоступно\n`
        information += `День: ${order.date}\n`
        information += `Время: ${order.time}\n`
        information += `Цена: ${order.price}\n`
        information += `Статус: ${order.status}`
      }

      report += information

      information = ''

      const send_text = (lang === kb.language.uz) ? kb.options.accepted.uz : kb.options.accepted.ru

      await bot.sendMessage(chat_id, report, {
        reply_markup: {
          inline_keyboard: [[{text: send_text, callback_data: JSON.stringify({phrase: text, id: data[i]._id})}]]
        }
      })

      report = ''
    }
  }

  if (kw === 'SHD') {
    for (let i = 0; i < items.length; i++) {
      const item = await getItem({_id: items[i]})

      if (lang === kb.language.uz) {
        clause += `\nMahsulot nomi: ${item.product}\n`
        clause += `Miqdori: ${item.quantity}\n`
        clause += `Narxi: ${item.price}\n`
      } else {
        clause += `\nТовар: ${item.product}\n`
        clause += `Число: ${item.quantity}\n`
        clause += `Цена: ${item.price}\n`
      }
      report += clause

      clause = ""
    }

    if (lang === kb.language.uz) {
      information += `\nMahsulot turi: ${data.total_items}\n`
      information += `Yetkazib berish: Mavjud\n`
      information += `Kuni: ${data.date}\n`
      information += `Vaqti: ${data.time}\n`
      information += `Narxi: ${data.price}\n`
      information += `Holati: ${data.status}`
    } else if (lang === kb.language.ru) {
      information += `\nТип продукта: ${data.total_items}\n`
      information += `Доставка: Есть\n`
      information += `День: ${data.date}\n`
      information += `Время: ${data.time}\n`
      information += `Цена: ${data.price}\n`
      information += `Статус: ${data.status}`
    }

    report += information

    information = null

    return report
  }

  if (kw === 'ONE_SHND') {
    for (let i = 0; i < items.length; i++) {
      const item = await getItem({_id: items[i]})

      if (lang === kb.language.uz) {
        clause += `\nMahsulot nomi: ${item.product}\n`
        clause += `Miqdori: ${item.quantity}\n`
        clause += `Narxi: ${item.price}\n`
      } else {
        clause += `\nТовар: ${item.product}\n`
        clause += `Число: ${item.quantity}\n`
        clause += `Цена: ${item.price}\n`
      }

      report += clause

      clause = ""
    }

    if (lang === kb.language.uz) {
      information += `\nMahsulot turi: ${data.total_items}\n`
      information += `Yetkazib berish: Mavjud emas\n`
      information += `Kuni: ${data.date}\n`
      information += `Vaqti: ${data.time}\n`
      information += `Narxi: ${data.price}\n`
      information += `Holati: ${data.status}`
    } else if (lang === kb.language.ru) {
      information += `\nТип продукта: ${data.total_items}\n`
      information += `Доставка: Недоступно\n`
      information += `День: ${data.date}\n`
      information += `Время: ${data.time}\n`
      information += `Цена: ${data.price}\n`
      information += `Статус: ${data.status}`
    }

    report += information

    information = null

    return report
  }

  if (kw === 'BK') {
    for (let i = 0; i < items.length; i++) {
      const item = await getItem({_id: items[i]})

      if (lang === kb.language.uz) {
        clause += `\nMahsulot nomi: ${item.product}\n`
        clause += `Miqdori: ${item.quantity}\n`
        clause += `Narxi: ${item.price}\n`
      } else if (lang === kb.language.ru) {
        clause += `\nТовар: ${item.product}\n`
        clause += `Число: ${item.quantity}\n`
        clause += `Цена: ${item.price}\n`
      }

      report += clause

      clause = ""
    }

    report += (lang === kb.language.uz) ? `\nUmumiy narx - ${data.price} so'm` : `\nОбщая стоимость ${data.price} сум`

    return report
  }

  if (kw === 'ADMIN') {
    for (let i = 0; i < data.length; i++) {
      const order = data[i], items = order.items

      for (let i = 0; i < items.length; i++) {
        const item = await getItem({_id: items[i]})

        clause = `${item.product} - ${item.quantity} - ${item.price}\n`

        report += clause

        clause = ''
      }

      await bot.sendMessage(chat_id, report, {
        reply_markup: {
          inline_keyboard: [[
            {text: 'Yetkazib berish', callback_data: JSON.stringify({phrase: 'DELIVER', id: order._id})}
          ]]
        }
      })

      report = ''
    }
  }

  if (kw === "EMPLOYEE_DELIVER") {
    for (let i = 0; i < data.length; i++) {
      const order = data[i], items = order.items

      for (let i = 0; i < items.length; i++) {
        const item = await getItem({_id: items[i]})

        clause = `${item.product} - ${item.quantity}\n`

        report += clause

        clause = ""
      }

      await bot.sendMessage(chat_id, report, {
        reply_markup: {
          inline_keyboard: [[{
            text: "Yetkazib berish", callback_data: JSON.stringify({phrase: 'deliver', id: order._id})
          }]]
        }
      })

      report = ""
    }
  }

  if (kw === "EMPLOYEE_OUT_OF_DELIVER") {
    for (let i = 0; i < items.length; i++) {
      const item = await getItem({_id: items[i]})

      clause += `\nMahsulot nomi: ${item.product}\n`
      clause += `Miqdori: ${item.quantity}\n`
      clause += `Narxi: ${item.price}\n`

      item.step = 5
      item.status = 'out_of_delivery'
      await item.save()

      report += clause

      clause = ""
    }

    information += `\nMahsulot turi: ${data.total_items}\n`
    information += `Yetkazib berish: Mavjud\n`
    information += `Yetkazib berish manzili: ${data.location.place_name}\n`
    information += `Kuni: ${data.date}\n`
    information += `Vaqti: ${data.time}\n`
    information += `Narxi: ${data.price}\n`

    report += information

    return report
  }

  if (kw === "EMPLOYEE_ALL") {
    for (let i = 0; i < data.length; i++) {
      const order = data[i], items = order.items

      for (let i = 0; i < items.length; i++) {
        const item = await getItem({_id: items[i]})

        clause += `\nMahsulot nomi: ${item.product}\n`
        clause += `Miqdori: ${item.quantity}\n`
        clause += `Narxi: ${item.price}\n`

        report += clause

        clause = ''
      }

      information += `\nMahsulot turi: ${order.total_items}\n`
      information += `Yetkazib berish: Mavjud\n`
      information += `Yetkazib berish manzili: ${order.location.place_name}\n`
      information += `Kuni: ${order.date}\n`
      information += `Vaqti: ${order.time}\n`
      information += `Narxi: ${order.price}\n`
      information += `Holati: Yetkazib berilgan`

      report += information

      information = ""

      await bot.sendMessage(chat_id, report, {reply_markup: {resize_keyboard: true, keyboard: kbb}})

      report = ""
    }
  }
}

module.exports = {
  inline_calendar,
  time_button,
  product_keyboard,
  order_edit_keyboard,
  determine_the_rating,
  bio,
  get_report
}
