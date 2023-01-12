import mongoose, {Document, Schema} from 'mongoose'
import {v4 as uuidv4} from 'uuid'

export interface IEmployee extends Document {
    _id: string
    telegram_id: number
    admin: number
    branch: string
    name: string
    username: string
    password: string
    number: string
    orders: string[]
    feedback: string[]
    total_orders: number
    total_feedback: number
    num_of_delivered_product: number
    task: string
    is_idler: boolean
    step: number
    status: string
    created_at: Date
}

const employeeSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    telegram_id: {
        type: Number,
        unique: true
    },
    admin: {
        type: Number,
        ref: 'Admin',
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
    orders: [{
        type: String,
        ref: 'Order',
        default: []
    }],
    feedback: [{
        type: String,
        ref: 'Feedback',
        default: []
    }],
    total_orders: {
        type: Number,
        default: 0
    },
    total_feedback: {
        type: Number,
        default: 0
    },
    num_of_delivered_product: {
        type: Number,
        default: 0
    },
    task: {
        type: String,
        enum: ['Nonvoy', 'Xamirchi', 'Yetkazib beruvchi'],
        default: 'Nonvoy'
    },
    is_idler: {
        type: Boolean,
        default: false
    },
    step: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['process', 'inactive', 'active'],
        default: 'process'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IEmployee>('Employee', employeeSchema)
