const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Employee = model('Employee', new Schema({
  _id: {type: String, default: v4},
  telegram_id: {type: Number, unique: true},
  admin: {type: Number, ref: 'Admin', required: true},
  branch: {type: String, ref: 'Branch'},
  name: {type: String, default: ''},
  username: {type: String, default: ''},
  password: {type: String, default: ''},
  number: {type: String, default: ''},
  orders: [{type: String, ref: 'Order', default: []}],
  feedback: [{type: String, ref: 'Feedback', default: []}],
  total_orders: {type: Number, default: 0},
  total_feedback: {type: Number, default: 0},
  num_of_delivered_product: {type: Number, default: 0},
  task: {type: String, enum: ['Nonvoy', 'Xamirchi', 'Yetkazib beruvchi'], default: 'Nonvoy'},
  is_idler: {type: Boolean, default: false},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Employee
