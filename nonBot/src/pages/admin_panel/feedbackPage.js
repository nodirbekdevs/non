const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {countFeedback} = require('./../../controllers/feedbackController')

const afs0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Fikrlar bo'limida nima qilamiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.feedback}
  })
}

const afs1 = async (bot, chat_id) => {
  let message

  const number = await countFeedback({}), process = await countFeedback({status: 'process'}),
  active = await countFeedback({status: 'active'}), inactive = await countFeedback({status: 'inactive'}),
  seen = await countFeedback({action: 'seen'}), done = await countFeedback({action: 'done'})

  message += `Umumiy fikrlar soni - ${number}\n`
  message += `Tugallanmagan fikrlar soni - ${process}\n`
  message += `Qabul qilingan fikrlar soni - ${active}\n`
  message += `Qabul qilinmagan fikrlar soni - ${inactive}\n`
  message += `\nKo'rilgan fikrlar soni - ${seen}\n`
  message += `Amalga oshirilgan fikrlar soni - ${done}`

  await bot.sendMessage(chat_id, message)
}

const adminFeedback = async (bot, chat_id, text) => {
  try {
      if (text === kb.admin.pages.feedback) await afs0(bot, chat_id)

      if (text === kb.admin.feedback.number) await afs1(bot, chat_id)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {adminFeedback}
