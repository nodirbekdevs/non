const kb = require('../../helpers/keyboard-buttons')
const keyboard = require('../../helpers/keyboard')
const {getAllFeedback, getOneFeedback, makeFeedback, updateFeedback, deleteFeedback, countFeedback} = require('../../controllers/feedbackController')
const {getUser} = require('../../controllers/userController')

let feedback_id

const ufs0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Fikr bildirish bo'limida nima qilamiz"
    kbb = keyboard.user.feedback.uz
  } else if (lang === kb.language.ru) {
    message = "Что мы делаем в разделе отзывов"
    kbb = keyboard.user.feedback.ru
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: kbb
    }
  })
}

const ufs1 = async (bot, chat_id, lang) => {
  let message, kbb

  const new_feedback = await makeFeedback({author: chat_id})
  feedback_id = new_feedback ? new_feedback._id : null

  if (lang === kb.language.uz) {
    message = `Biz haqimizda nima deb o'ylaysiz`
    kbb = keyboard.options.feedback.uz
  } else if (lang === kb.language.ru) {
    message = 'Что вы думаете о нас?'
    kbb = keyboard.options.feedback.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ufs2 = async (bot, _id, lang, text) => {
  let message, kbb

  await updateFeedback({_id}, {mark: text, step: 1})

  const feedback = await getOneFeedback({_id})

  if (lang === kb.language.uz) {
    message = `Nega ${feedback.mark} ligini sababini yozing`
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = `Напишите причину, по которой ${feedback.mark}`
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(feedback.author, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ufs3 = async (bot, _id, lang, text) => {
  let message, kbb

  await updateFeedback({_id}, {reason: text, step: 2, status: 'active'})

  const feedback = await getOneFeedback({_id}), user = await getUser({telegram_id: feedback.author})

  if (feedback.mark === kb.options.feedback.uz || feedback.mark === kb.options.feedback.ru) {
    await updateFeedback({_id: feedback._id}, {action: 'done'})
  }

  if (user) {
    user.feedback.push(feedback._id)
    user.total_feedback += 1
    await user.save()
  }

  if (lang === kb.language.uz) {
    message = `Fikringiz muvaffaqiyatli bildirildi`
    kbb = keyboard.user.feedback.uz
  } else if (lang === kb.language.ru) {
    message = `Ваш отзыв успешно оставлен`
    kbb = keyboard.user.feedback.ru
  }

  await bot.sendMessage(feedback.author, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ufs4 = async (bot, id, lang) => {
  let message = ''
  const
    feedback = await getAllFeedback({author: id}),
    count = await countFeedback({author: id}),
    author = await getUser({telegram_id: id}),
    active = await countFeedback({author: id, status: 'active'}),
    inactive = await countFeedback({author: id, status: 'inactive'})

  if (count > 0) {
    let clause = '', status

    for (let i = 0; i < feedback.length; i++) {
      const item = feedback[i]

      if (item.action === 'process') status = "Ko'rildi"
      else if (item.action === 'seen') status = 'Bajarilmoqda'
      else status = 'Bajarildi'

      clause += `avtor: ${author.name}\n`
      clause += `Baho: ${item.mark}\n`
      clause += `Sabab: ${item.reason}\n`
      clause += `Holat - ${status}\n`

      await bot.sendMessage(id, clause)
    }

    if (lang === kb.language.uz) {
      message += `${author.name} siz umumiy ${count} fikr bildirgansiz\n`
      message += `${active} tugallangan fikrlaringiz soni\n`
      message += `${inactive} ohiriga yetmagan fikrlaringiz soni`
    } else if (lang === kb.language.ru) {
      message += `${author.name} Вы предоставили всего ${count} коментарии\n`
      message += `${active} количество закрытых коментарии\n`
      message += `${inactive} количество не закрытых коментарии`
    }
  } else if (count === 0 || count < 0) {
    message = (lang === kb.language.uz) ? "Hozircha siz fikr bildirmagansiz" : "Пока вы не прокомментировали"
  }

  await bot.sendMessage(id, message)
}

const ufs5 = async (bot, chat_id, _id, lang) => {
  await deleteFeedback({_id})
  await ufs0(bot, chat_id, lang)
}

const userFeedback = async (bot, chat_id, name, lang, text) => {

  const feedback = await getOneFeedback({_id: feedback_id, status: 'process'})
    ? await getOneFeedback({_id: feedback_id, status: 'process'})
    : (await getAllFeedback({author: chat_id, status: 'process'}))[0]

  try {
    if (text === kb.user.pages.uz.feedback || text === kb.user.pages.ru.feedback) await ufs0(bot, chat_id, lang)
    else if (text === kb.user.feedback.uz.add || text === kb.user.feedback.ru.add) await ufs1(bot, chat_id, lang)
    else if (text === kb.user.feedback.uz.my_feedback || text === kb.user.feedback.ru.my_feedback) await ufs4(bot, chat_id, lang)

    if (feedback) {
      if (feedback.step === 0 && !(text === kb.options.back.uz || text === kb.options.back.ru)) await ufs2(bot, feedback._id, lang, text)
      else if (feedback.step === 1 && !(text === kb.options.back.uz || text === kb.options.back.ru)) await ufs3(bot, feedback._id, lang, text)
      else if (feedback.step >= 0 && (text === kb.options.back.uz || text === kb.options.back.ru)) await ufs5(bot, chat_id, feedback._id, lang)
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = {userFeedback}
