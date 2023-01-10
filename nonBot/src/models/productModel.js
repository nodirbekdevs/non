const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Product = model('Product', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, ref: 'Admin', required: true},
  image: {type: String, default: ''},
  product_name: {$type: String, default: ''},
  description: {type: String, default: ''},
  rating: [{type: Number, default: []}],
  num_of_sold: {type: Number, default: 0},
  price: {type: Number, default: 0},
  liked_users: [{type: String, ref: 'User', default: []}],
  total_liked_users: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Product
