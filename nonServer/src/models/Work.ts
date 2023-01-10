import mongoose, {Document, Schema} from 'mongoose'
import {v4 as uuidv4} from 'uuid'

export interface IWork extends Document {
    _id: string
    admin: number
    type: string
    description: string
    status: string
    created_at: Date
}

const workSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    admin: {
        type: Number,
        ref: 'Admin',
        required: true
    },
    type: {
        type: String,
        enum: ['On', 'Off'],
        default: 'Off'
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IWork>('Work', workSchema)
