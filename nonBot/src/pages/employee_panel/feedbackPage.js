const kb = require('../../helpers/keyboard-buttons')
const keyboard = require('../../helpers/keyboard')
const {getAllFeedback, getOneFeedback, makeFeedback, updateFeedback, deleteFeedback, countFeedback} = require('../../controllers/feedbackController')
const {getEmployee} = require('../../controllers/employeeController')
const {getUser} = require('./../../controllers/userController')

let feedback_id

const efs0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Fikrlar bo'limida nima qilamiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.feedback}
  })
}

const efs1 = async (bot, chat_id) => {
  const new_feedback = await makeFeedback({author: chat_id, is_employee: true})
  feedback_id = new_feedback._id

  await bot.sendMessage(chat_id, `Biz haqimizda nima deb o'ylaysiz`, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.feedback.uz}
  })
}

const efs2 = async (bot, chat_id, _id, text) => {
  await updateFeedback({_id}, {mark: text, step: 1})

  const feedback = await getOneFeedback({_id})

  await bot.sendMessage(chat_id, `Nega ${feedback.mark} ligini sababini yozing`, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const efs3 = async (bot, chat_id, _id, text) => {
  await updateFeedback({_id}, {reason: text, step: 2, status: 'active'})

  const feedback = await getOneFeedback({_id}), employee = await getEmployee({telegram_id: chat_id})

  if (feedback.mark === kb.options.feedback.uz.good || feedback.mark === kb.options.feedback.ru.good) {
    await updateFeedback({_id: feedback._id}, {action: 'done'})
  }

  if (employee) {
    employee.feedback.push(_id)
    employee.total_feedback += 1
    await employee.save()
  }

  await bot.sendMessage(chat_id, `Fikringiz muvaffaqiyatli bildirildi`, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.employee.feedback}
  })
}

const efs4 = async (bot, id) => {
  let message = ''

  const
    feedback = await getAllFeedback({author: id}),
    count = await countFeedback({author: id}),
    author = await getEmployee({telegram_id: id}),
    active = await countFeedback({author: id, status: 'active'}),
    inactive = await countFeedback({author: id, status: 'inactive'})

  if (count > 0) {
    let word = '', status
    for (let i = 0; i < feedback.length; i++) {
      const item = feedback[i]

      if (item.action === 'process') status = "Ko'rildi"
      else if (item.action === 'seen') status = 'Bajarilmoqda'
      else status = 'Bajarildi'

      word += `Muallif - ${author.name}\n`
      word += `Baho - ${item.mark}\n`
      word += `Sabab - ${item.reason}\n`
      word += `Holat - ${status}`

      await bot.sendMessage(id, word)

      word = ""
    }

    message += `${author.name} siz umumiy ${count} fikr bildirgansiz\n`
    message += `${active} tugallangan fikrlaringiz soni\n`
    message += `${inactive} xato fikrlaringiz soni`

  } else if (count <= 0) {
    message = "Hozircha siz fikr qoldirmagansiz"
  }

  await bot.sendMessage(id, message)
}

const efs5 = async (bot, _id, author) => {
  await deleteFeedback({_id})
  await efs0(bot, author)
}

const employeeFeedback = async (bot, chat_id, name, text) => {

  const feedback = await getOneFeedback({_id: feedback_id, status: 'process'})
    ? await getOneFeedback({_id: feedback_id, status: 'process'})
    : (await getAllFeedback({author: chat_id, status: 'process'}))[0]

  try {
    if (text === kb.employee.pages.feedback) await efs0(bot, chat_id)
    else if (text === kb.employee.feedback.add) await efs1(bot, chat_id)
    else if (text === kb.employee.feedback.my_feedback) await efs4(bot, chat_id)

    if (feedback) {
      if (feedback.step === 0 && text !== kb.options.back.uz) await efs2(bot, chat_id, feedback._id, text)
      else if (feedback.step === 1 && text !== kb.options.back.uz) await efs3(bot, chat_id, feedback._id, text)
      else if (feedback.step >= 0 && text === kb.options.back.uz) await efs5(bot, feedback._id, feedback.author)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {employeeFeedback}
