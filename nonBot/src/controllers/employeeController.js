const Employee = require('./../models/employeeModel')
const {getAdmin} = require('./adminController')

const getEmployees = async (query) => {
  try {
    return await Employee.find(query)
  } catch (e) {
    console.log(e)
  }
}

const getEmployee = async (query) => {
  try {
    return await Employee.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeEmployee = async (data) => {
  try {
    const admin = await getAdmin({telegram_id: data.admin})

    return await Employee.create({...data, branch: admin.branch})
  } catch (e) {
    console.log(e)
  }
}

const updateEmployee = async (query, data) => {
  try {
    return await Employee.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const updateManyEmployees = async (query, data) => {
  try {
    return await Employee.updateMany(query, data)
  } catch (e) {
    console.log(e)
  }
}

const deleteEmployee = async (query) => {
  try {
    return await Employee.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countEmployees = async (query) => {
  try {
    return await Employee.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getEmployees, getEmployee, makeEmployee, updateEmployee, updateManyEmployees, deleteEmployee, countEmployees}
