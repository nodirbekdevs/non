const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Admin = model('Admin', new Schema({
  _id: {type: String, default: v4},
  telegram_id: {type: Number, unique: true, required: true},
  branch: {type: String, ref: 'Branch'},
  name: {type: String, default: ''},
  username: {type: String, default: ''},
  password: {type: String, default: ''},
  number: {type: String, default: ''},
  advertisements: [{type: String, ref: 'Advertising', default: []}],
  products: [{type: String, ref: 'Product', default: []}],
  total_advertisements: {type: Number, default: 0},
  total_products: {type: Number, default: 0},
  step: {type: Number, default: 0},
  type: {type: String, enum: ['admin', 'super_admin'], default: 'admin'},
  status: {type: String, enum: ['inactive', 'active'], default: 'active'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Admin
