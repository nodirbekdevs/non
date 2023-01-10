import mongoose, {Document, Schema} from 'mongoose'
import {v4 as uuidv4} from 'uuid'

export interface IItem extends Document {
    _id: string
    author: number
    order: string
    product: string
    quantity: number
    price: number
    situation: string
    step: number
    status: string
    created_at: Date
}

const itemSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    author: {
        type: Number,
        ref: 'User'
    },
    order: {
        type: String,
        ref: 'Order',
        default: ''
    },
    product: {
        type: String,
        ref: 'Product',
        default: ''
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    situation: {
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

export default mongoose.model<IItem>('Item', itemSchema)
