import { WorkRepository } from '../repo/work'
import Work, { IWork } from '../../models/Work'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class WorkStorage implements WorkRepository {
    private scope = 'storage.work'

    async find(query: Object): Promise<IWork[]> {
        try {
            const works = await Work.find(query)

            return works
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IWork> {
        try {
            const work = await Work.findOne(query)

            if (!work) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'work_404')
            }

            return work
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IWork): Promise<IWork> {
        try {
            const work = await Work.create(payload)

            return work
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: IWork | object): Promise<IWork> {
        try {
            const work = await Work.findOneAndUpdate(query, payload, { new: true })

            if (!work) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'work_404')
            }

            return work
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IWork> {
        try {
            const work = await Work.findOneAndDelete(query)

            if (!work) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'work_404')
            }

            return work
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
