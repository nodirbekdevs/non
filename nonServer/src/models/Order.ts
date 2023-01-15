import mongoose, {Document, Schema} from 'mongoose'
import {v4 as uuidv4} from 'uuid'

export interface IOrder extends Document {
    _id: string
    admin: number
    author: number
    supplier: number
    branch: string
    items: string[]
    total_items: number
    price: number
    date: string
    time: string
    should_deliver: boolean
    location: {
        place_name: string
        latitude: string
        longitude: string
    }
    signature: string
    step: number
    attempt: number
    status: string
    received_at: Date
    created_at: Date
}

const orderSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    admin: {
        type: Number,
        ref: 'Admin',
        required: true
    },
    author: {
        type: Number,
        ref: 'User',
        required: true
    },
    supplier: {
        type: Number,
        ref: 'Employee'
    },
    branch: {
        type: String,
        ref: 'Branch',
        default: ''
    },
    items: [{
        type: String,
        ref: 'Item',
        default: []
    }],
    total_items: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: ''
    },
    time: {
        type: String,
        default: ''
    },
    should_deliver: {
        type: Boolean,
        default: false
    },
    location: {
        place_name: {
            type: String,
            default: ''
        },
        latitude: {
            type: String,
            default: ''
        },
        longitude: {
            type: String,
            default: ''
        }
    },
    signature: {
        type: String,
        default: ''
    },
    step: {
        type: Number,
        default: 0
    },
    attempt: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['process', 'inactive', 'active', 'approved', 'out_of_delivery', 'delivered', 'accepted'],
        default: 'process'
    },
    received_at: {
        type: Date
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IOrder>('Order', orderSchema)
