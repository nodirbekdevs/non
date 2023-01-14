const Branch = require('./../models/branchModel')
const {getAdmin, updateAdmin} = require('./adminController')
const {getAllFeedback} = require('./feedbackController')
const {updateEmployee, updateManyEmployees} = require('./employeeController')

const getBranches = async (query) => {
  try {
    return await Branch.find(query)
  } catch (e) {
    console.log(e)
  }
}

const getBranch = async (query) => {
  try {
    return await Branch.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeBranch = async (telegram_id) => {
  try {
    const admin = await getAdmin({telegram_id})
    const branch = await Branch.create({admin: admin.telegram_id})
    admin.branch = branch._id
    await admin.save()
    return branch
  } catch (e) {
    console.log(e)
  }
}

const updateBranch = async (query, data, text) => {
  try {
    let admin, branch
    if (data.admin) admin = query.admin
    branch = await getBranch(query)
    if (branch.admin !== admin) {
      await updateAdmin({telegram_id: branch.admin}, {branch: ''})
      await updateAdmin({telegram_id: admin}, {branch: branch._id})
    }
    branch = await Branch.findOneAndUpdate(query, data, {new: true})
    return branch
  } catch (e) {
    console.log(e)
  }
}

const deleteBranch = async (query) => {
  try {
    let status = true
    const branch = await getBranch(query), employees = branch.employees,
      orders = await getBranches({branch: branch._id}), feedback = await getAllFeedback({branch: branch._id})

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i]

      if (order.status !== 'delivered' || order.status !== 'accepted') {
        status = false
      }
    }

    for (let i = 0; i < feedback.length; i++) {
      const feed = feedback[i]

      if (feed !== 'active') {
        status = false
      }
    }

    if (status) {
      await updateAdmin({telegram_id: branch.admin}, {branch: ''})
      // await updateManyEmployees({branch: branch._id}, {branch: ''})

      for (let i = 0; i < employees.length; i++) {
        await updateEmployee({branch: branch._id}, {branch: ''})
      }
    }

    return status
  } catch (e) {
    console.log(e)
  }
}

const countBranches = async (query) => {
  try {
    return await Branch.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getBranches, getBranch, makeBranch, updateBranch, deleteBranch, countBranches
}
