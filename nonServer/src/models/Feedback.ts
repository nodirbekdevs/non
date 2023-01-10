import mongoose, {Document, Schema} from 'mongoose'
import {v4 as uuidv4} from 'uuid'

export interface IFeedback extends Document {
    _id: string
    author: number
    branch: string
    is_employee: boolean
    mark: string
    reason: string
    action: string
    step: number
    status: string
    created_at: Date
}

const feedbackSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    author: {
        type: Number
    },
    branch: {
        type: String,
        ref: 'Branch',
        default: ''
    },
    is_employee: {
        type: Boolean,
        default: false
    },
    mark: {
        type: String,
        default: ''
    },
    reason: {
        type: String,
        default: ''
    },
    action: {
      type: String,
      enum: ['process', 'seen', 'done'],
      default: 'process'
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

export default mongoose.model<IFeedback>('Feedback', feedbackSchema)
