const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getAdvertisements, getAdvertising, makeAdvertising, updateAdvertising, countAdvertisements} = require('./../../controllers/advertisingController')
const {getAdmin} = require('./../../controllers/adminController')
const {getUsers} = require('./../../controllers/userController')

let advertising_id

const aas0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Rekmala bo'limida nima qilamiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.advertising}
  })
}

const aas1 = async (bot, chat_id) => {
  const number = await countAdvertisements({})
  const active = await countAdvertisements({status: 'active'})
  const inactive = await countAdvertisements({status: 'inactive'})
  const approved = await countAdvertisements({status: 'approved'})

  const word = `
    Umumiy reklamalar soni - ${number}
    Tugallangan reklamalar soni - ${active}
    Xato reklamalar soni - ${inactive}
    Tasdiqlangan reklamalar soni - ${approved}
  `

  await bot.sendMessage(chat_id, word)
}

const aas2 = async (bot, chat_id) => {
  const advertising = await getAdvertisements({status: 'active'}),
    count = await countAdvertisements({status: 'active'}),
    author = await getAdmin({telegram_id: chat_id})

  advertising.map(async item => {
    if (item.status === 'active') {
      const message = `
      author: ${author.name},
      title: ${item.title},
      description: ${item.description}
    `
      if (item.status === 'approved') {
        await bot.sendPhoto(chat_id, item.image, {caption: message})
      }

      await bot.sendPhoto(chat_id, item.image, {
        caption: message,
        reply_markup: {
          resize_keyboard: true,
          inline_keyboard: [
            [
              {text: kb.options.send_advertise, callback_data: JSON.stringify({phrase: kb.options.send_advertise, id: advertising._id})}
            ]
          ]
        }
      })
    }
  })

  await bot.sendMessage(chat_id, `Barcha reklamalar - ${count}`)
}

const aas3 = async (bot, chat_id) => {
  const advertising = await makeAdvertising(chat_id)
  advertising_id = advertising._id

  await bot.sendMessage(chat_id, "Reklama joylashga hush kelibsiz")
  await bot.sendMessage(chat_id, "Reklamani rasmini jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aas4 = async (bot, chat_id, _id, text) => {
  await updateAdvertising({_id}, {image: text, step: 1})
  await bot.sendMessage(chat_id, "Reklamaning sarlavhasini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aas5 = async (bot, chat_id, _id, text) => {
  await updateAdvertising({_id}, {title: text, step: 2})

  await bot.sendMessage(chat_id, "Reklama tavsifini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aas6 = async (bot, chat_id, advertising, text) => {
  await updateAdvertising({_id: advertising._id}, {description: text, step: 3})

  const word = `
            title: ${advertising.title},
            description: ${advertising.description},

            "Tugatilganini tasdiqlaysizmi ?"
          `

  await bot.sendPhoto(chat_id, advertising.image, {
    caption: word, reply_markup: {resize_keyboard: true, keyboard: keyboard.options.confirmation_advertising}
  })
}

const aas7 = async (bot, chat_id, advertising, text) => {
  let message

  if (text === kb.options.confirmation_advertising.yes) {
    await updateAdvertising({_id: advertising._id}, {step: 4, status: 'active'})
    message = "Reklama muvaffaqiyatli yakunlandi"

    const inflection = `
            title: ${advertising.title},
            description: ${advertising.description},
          `

    await bot.sendPhoto(chat_id, advertising.image, {
      caption: inflection,
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          [
            {text: kb.options.send_advertise, callback_data: JSON.stringify({phrase: kb.options.send_advertise, id: advertising._id})}
          ]
        ]
      }
    })
  }
  if (text === kb.options.confirmation_advertising.no) {
    await updateAdvertising({_id: advertising._id}, {step: 5, status: 'inactive'})
    message = "Reklama muvaffaqiyatli yakunlanmadi"
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.advertising}
  })
}

const aas8 = async (bot, chat_id, _id) => {
  const advertising = await getAdvertising({_id}), users = await getUsers({status: 'active'})

  users.map(async u => {
    const message = `
            title: ${advertising.title},
            description: ${advertising.description},
          `

    await bot.sendPhoto(u.telegram_id, advertising.image, {caption: message})
  })

  await bot.sendMessage(chat_id, "Reklama barchaga yuborildi")
}

const adminAdvertising = async (bot, chat_id, text) => {

  const advertising = await getAdvertising({_id: advertising_id, status: 'process'})
    ? await getAdvertising({_id: advertising_id, status: 'process'})
    : (await getAdvertisements({author: chat_id, status: 'process'}))[0]

  if (text === kb.admin.pages.advertising) await aas0(bot, chat_id)

  if (text === kb.admin.advertising.number) await aas1(bot, chat_id)

  if (text === kb.admin.advertising.all) await aas2(bot, chat_id)

  if (text === kb.admin.advertising.add) await aas3(bot, chat_id)

  if (advertising) {
    if (advertising.step === 0) await aas4(bot, chat_id, advertising._id, text)

    if (advertising.step === 1) await aas5(bot, chat_id, advertising._id, text)

    if (advertising.step === 2) await aas6(bot, chat_id, advertising, text)

    if (advertising.step === 3) await aas7(bot, chat_id, advertising, text)

    if (text === kb.options.back.uz) {
      await updateAdvertising({_id: advertising._id}, {step: 5, status: 'inactive'})
      await aas0(bot, chat_id)
    }
  }
}

module.exports = {adminAdvertising, aas8}
