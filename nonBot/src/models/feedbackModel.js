const {Schema, model} = require('mongoose')
const {v4} = require('uuid')

const Feedback = model('Feedback', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, required: true},
  branch: {type: String, ref: 'Branch', default: ''},
  is_employee: {type: Boolean, default: false},
  mark: {type: String, default: ''},
  reason: {type: String, default: ''},
  action: {type: String, enum: ['process', 'seen', 'done'], default: 'process'},
  is_read: {type: Boolean, default: false},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Feedback
