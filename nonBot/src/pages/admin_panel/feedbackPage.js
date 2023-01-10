const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {countFeedback} = require('./../../controllers/feedbackController')

const afs0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Fikrlar bo'limida nima qilamiz", {
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.admin.feedback
    }
  })
}

const afs1 = async (bot, chat_id) => {
  const number = await countFeedback({})
  const process = await countFeedback({status: 'process'})
  const active = await countFeedback({status: 'active'})
  const inactive = await countFeedback({status: 'inactive'})
  const seen = await countFeedback({action: 'seen'})
  const done = await countFeedback({action: 'done'})

  const message = `
    Umumiy fikrlar soni - ${number}
    Tugallanmagan fikrlar soni - ${process}
    Qabul qilingan fikrlar soni - ${active}
    Qabul qilinmagan fikrlar soni - ${inactive}
    
    Ko'rilgan fikrlar soni - ${seen}
    Amalga oshirilgan fikrlar soni - ${done}
  `

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
