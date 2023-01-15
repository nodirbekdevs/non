const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Order = model('Order', new Schema({
  _id: {type: String, default: v4},
  admin: {type: Number, ref: 'Admin'},
  author: {type: Number, ref: 'User', required: true},
  supplier: {type: Number, ref: 'Employee'},
  branch: {type: String, ref: 'Branch'},
  items: [{type: String, ref: 'Item', default: []}],
  total_items: {type: Number, default: 0},
  price: {type: Number, default: 0},
  date: {type: String, default: ''},
  time: {type: String, default: ''},
  should_deliver: {type: Boolean, default: false},
  location: {
    place_name: {type: String, default: ''},
    latitude: {type: String, default: ''},
    longitude: {type: String, default: ''}
  },
  signature: {type: String, default: ''},
  step: {type: Number, default: 0},
  attempt: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active', 'approved', 'out_of_delivery', 'delivered', 'accepted'], default: 'process'},
  received_at: {type: Date},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Order
