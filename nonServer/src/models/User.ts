import mongoose, {Document, Schema} from 'mongoose'
import {v4 as uuidv4} from 'uuid'

export interface IUser extends Document {
    _id: string
    telegram_id: number
    name: string
    username: string
    password: string
    number: string
    feedback: string[]
    orders: string[]
    liked_products: string[]
    total_feedback: number
    total_orders: number
    total_liked_products: number
    num_of_bought: number
    lang: string
    step: number
    status: string
    created_at: Date
}

const userSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    telegram_id: {
        type: Number,
        unique: true,
        required: true
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
    feedback: [{
        type: String,
        ref: 'Feedback',
        default: []
    }],
    orders: [{
        type: String,
        ref: 'Order',
        default: []
    }],
    liked_products:[{
        type: String,
        ref: 'Product',
        default: []
    }],
    total_feedback: {
        type: Number,
        default: 0
    },
    total_orders: {
        type: Number,
        default: 0
    },
    total_liked_products: {
        type: Number,
        default: 0
    },
    num_of_bought: {
        type: Number,
        default: 0
    },
    lang: {
        type: String,
        default: ''
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

export default mongoose.model<IUser>('User', userSchema)
