import mongoose, {Document, Schema} from 'mongoose'
import {v4 as uuidv4} from 'uuid'

export interface IProduct extends Document {
    _id: string
    author: number
    image: string
    product_name: string
    description: string
    rating: number[]
    num_of_sold: number
    price: number
    liked_users: string[]
    total_liked_users: number
    step: number
    status: string
    created_at: Date
}

const productSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    author: {
        type: Number,
        ref: 'Admin',
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    product_name: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    rating: [{
        type: Number,
        default: []
    }],
    num_of_sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    liked_users: [{
        type: String,
        ref: 'User',
        default: [],
    }],
    total_liked_users: {
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

export default mongoose.model<IProduct>('Product', productSchema)
