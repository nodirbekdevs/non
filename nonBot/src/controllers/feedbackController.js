const Feedback = require('./../models/feedbackModel')
const {getUser} = require('./userController')
const {getEmployee} = require('./employeeController')

const getAllFeedback = async (query) => {
  try {
    return await Feedback.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getOneFeedback = async (query) => {
  try {
    return await Feedback.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeFeedback = async (query) => {
  try {
    let feedback

    if (query.is_employee) {
      const employee = await getEmployee({telegram_id: query.telegram_id})

      feedback = await Feedback.create({author: query.telegram_id, is_employee: query.is_employee})

      employee.feedback.push(feedback._id)
      employee.total_feedback += 1
      await employee.save()
    }

    if (!query.is_employee) {
      const user = await getUser({telegram_id: query.telegram_id})

      feedback = await Feedback.create({author: query.telegram_id})

      user.feedback.push(feedback._id)
      user.total_feedback += 1
      await user.save()
    }

    return feedback
  } catch (e) {
    console.log(e)
  }
}

const updateFeedback = async (query, data) => {
  try {
    return await Feedback.findOneAndUpdate(query, data)
  } catch (e) {
    console.log(e)
  }
}

const deleteFeedback = async (query) => {
  try {
    const feedback = await getOneFeedback(query)

    if (feedback.is_employee) {
      const employee = await getEmployee({telegram_id: feedback.author})
      const index = employee.feedback.indexOf(feedback._id)
      if (index > -1) {
        employee.feedback.splice(index)
        employee.total_feedback -= 1
      }
      await user.save()
    }

    if (!feedback.is_employee) {
      const user = await getUser({telegram_id: feedback.author})
      const index = user.feedback.indexOf(feedback._id)
      if (index > -1) {
        user.feedback.splice(index)
        user.total_feedback -= 1
      }
      await user.save()
    }

    return await Feedback.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countFeedback = async (query) => {
  try {
    return await Feedback.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getAllFeedback, getOneFeedback, makeFeedback, updateFeedback, deleteFeedback, countFeedback}
