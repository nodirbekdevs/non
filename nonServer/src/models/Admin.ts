import mongoose, {Document, Schema} from 'mongoose'
import {v4 as uuidv4} from 'uuid'

export interface IAdmin extends Document {
    _id: string
    telegram_id: number
    branch: string
    name: string
    username: string
    password: string
    number: string
    advertisements: string[]
    products: string[]
    total_advertisements: number
    total_products: number
    step: number
    type: string
    status: string
    created_at: Date
}

const adminSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    telegram_id: {
        type: Number,
        unique: true,
        required: true
    },
    branch: {
      type: String,
      ref: 'Branch',
      default: ''
    },
    name: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    number: {
        type: String,
        default: ''
    },
    advertisements: [{
        type: String,
        ref: 'Advertising',
        default: []
    }],
    products: [{
        type: String,
        ref: 'Product',
        default: []
    }],
    total_advertisements: {
        type: Number,
        default: 0
    },
    total_products: {
        type: Number,
        default: 0
    },
    step: {
        type: Number,
        default: 0
    },
    type: {
      type: String,
      enum: ['admin', 'super_admin'],
      default: 'admin'
    },
    status: {
        type: String,
        enum: ['inactive', 'active'],
        default: 'active'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IAdmin>('Admin', adminSchema)
