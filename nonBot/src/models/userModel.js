const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const User = model('User', new Schema({
  _id: {type: String, default: v4},
  telegram_id: {type: Number, unique: true, required: true},
  name: {type: String, default: ''},
  username: {type: String, default: ''},
  password: {type: String, default: ''},
  number: {type: String, default: ''},
  feedback: [{type: String, ref: 'Feedback', default: []}],
  orders: [{type: String, ref: 'OrderItem', default: []}],
  liked_products: [{type: String, ref: 'Product', default: []}],
  total_feedback: {type: Number, default: 0},
  total_orders: {type: Number, default: 0},
  total_liked_products: {type: Number, default: 0},
  num_of_bought: {type: Number, default: 0},
  lang: {type: String, default: ''},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'active'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = User
