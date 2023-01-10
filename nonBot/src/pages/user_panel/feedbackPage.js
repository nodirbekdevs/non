const kb = require('../../helpers/keyboard-buttons')
const keyboard = require('../../helpers/keyboard')
const {getAllFeedback, getOneFeedback, makeFeedback, updateFeedback, countFeedback} = require('../../controllers/feedbackController')
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

  const new_feedback = await makeFeedback({telegram_id: chat_id})
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

  const feedback = await getOneFeedback({_id})

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
  let message
  const
    feedback = await getAllFeedback({author: id}),
    count = await countFeedback({author: id}),
    author = await getUser({telegram_id: id}),
    completed = await countFeedback({author: id, status: 'active'}),
    mistake = await countFeedback({author: id, status: 'inactive'})

  if (count > 0) {
    feedback.map(async item => {
      const clause = `
        avtor: ${author.name}
        Baho: ${item.mark}
        Sabab: ${item.reason}
      `
      await bot.sendMessage(id, clause)
    })

    message = (lang === kb.language.uz)
      ? `${author.name} siz umumiy ${count} fikr bildirgansiz.
        ${completed} tugallangan fikrlaringiz soni
        ${mistake} ohiriga yetmagan fikrlaringiz soni`
      : `${author.name} Вы предоставили всего ${count} коментарии.
        ${completed} количество закрытых коментарии
        ${mistake} количество не закрытых коментарии`

  } else if (count === 0 || count < 0) {
    message = (lang === kb.language.uz) ? "Hozircha siz fikr bildirmagansiz" : "Пока вы не прокомментировали"
  }

  await bot.sendMessage(id, message)
}

const ufs5 = async (bot, chat_id, _id, lang) => {
  await updateFeedback({_id}, {step: 3, status: 'inactive'})
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
