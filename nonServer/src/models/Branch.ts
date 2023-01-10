import mongoose, {Document, Schema} from 'mongoose'
import {v4 as uuidv4} from 'uuid'

export interface IBranch extends Document {
    _id: string
    admin: number
    name: string
    image: string
    location: {
        name: string
        latitude: string
        longitude: string
    }
    employees: string[]
    orders: string[]
    feedback: string[]
    total_employees: number
    total_orders: number
    total_feedback: number
    step: number
    status: string
    created_at: Date
}

const brancgSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    admin: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    location: {
        name: {
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
    employees: [{
        type: String,
        ref: 'Employee',
        default: []
    }],
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
    total_employees: {
        type: Number,
        default: 0
    },
    total_orders: {
        type: Number,
        default: 0
    },
    total_feedback: {
        type: Number,
        default: 0
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

export default mongoose.model<IBranch>('Branch', brancgSchema)
