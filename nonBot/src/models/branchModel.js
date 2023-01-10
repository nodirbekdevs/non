const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Branch = model('Branch', new Schema({
  _id: {type: String, default: v4},
  admin: {type: Number, ref: 'Admin', required: true},
  name: {type: String, default: ''},
  image: {type: String, default: ''},
  location: {
    name: {type: String, default: ''},
    latitude: {type: String, default: ''},
    longitude: {type: String, default: ''}
  },
  employees: [{type: String, ref: 'Employee', default: []}],
  orders: [{type: String, ref: 'Order', default: []}],
  total_employees: {type: Number, default: 0},
  total_orders: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Branch
