import { FeedbackRepository } from '../repo/feedback'
import Feedback , { IFeedback } from '../../models/Feedback'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class FeedbackStorage implements FeedbackRepository {
    private scope = 'storage.feedback'

    async find(query: Object): Promise<IFeedback[]> {
        try {
            const feedback = await Feedback.find(query)

            return feedback
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IFeedback> {
        try {
            const feedback = await Feedback.findOne(query)

            if (!feedback) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'feedback_404')
            }

            return feedback
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IFeedback): Promise<IFeedback> {
        try {
            const feedback = await Feedback.create(payload)

            return feedback
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: IFeedback | Object): Promise<IFeedback> {
        try {
            const feedback = await Feedback.findOneAndUpdate(query, payload, { new: true })

            if (!feedback) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'feedback_404')
            }

            return feedback
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IFeedback> {
        try {
            const feedback = await Feedback.findOneAndDelete(query)

            if (!feedback) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'feedback_404')
            }

            return feedback
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
