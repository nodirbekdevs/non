const User = require('./../models/userModel')

const getUsers = async (query) => {
  try {
    return await User.find(query)
  } catch (e) {
    console.log(e)
  }
}

const getUser = async (query) => {
  try {
    return await User.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeUser = async (data) => {
  try {
    return await User.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateUser = async (query, data) => {
  try {
    return await User.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteUser = async (query) => {
  try {
    return await User.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countUsers = async (query) => {
  try {
    return await User.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getUsers, getUser, makeUser, updateUser, deleteUser, countUsers}
