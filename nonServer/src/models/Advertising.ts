import mongoose, {Document, Schema} from 'mongoose'
import {v4 as uuidv4} from 'uuid'

export interface IAdvertising extends Document {
    _id: string
    author: number
    image: string
    title: string
    description: string
    step: number
    status: string
    created_at: Date
}

const advertisingSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    author: {
        type: Number,
        ref: 'Admin'
    },
    image: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    step: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['process', 'inactive', 'active', 'approved'],
        default: 'process'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IAdvertising>('Advertising', advertisingSchema)
