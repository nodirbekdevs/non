const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Item = model('Item', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, ref: 'User', required: true},
  order: {type: String, ref: 'Order', default: ''},
  product: {type: String, ref: 'Product', default: ''},
  quantity: {type: Number, default: 0},
  price: {type: Number, default: 0},
  situation: {type: String, default: ''},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active', 'ordered', 'approved', 'out_of_delivery', 'delivered', 'accepted'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Item
