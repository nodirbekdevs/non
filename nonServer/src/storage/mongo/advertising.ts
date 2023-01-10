import { AdvertisingRepository } from '../repo/advertising'
import Advertising , { IAdvertising } from '../../models/Advertising'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class AdvertisingStorage implements AdvertisingRepository {
    private scope = 'storage.advertising'

    async find(query: Object): Promise<IAdvertising[]> {
        try {
            const advertising = await Advertising.find(query)

            return advertising
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IAdvertising> {
        try {
            const advertising = await Advertising.findOne(query)

            if (!advertising) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'advertising_404')
            }

            return advertising
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IAdvertising): Promise<IAdvertising> {
        try {
            const advertising = await Advertising.create(payload)

            return advertising
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: IAdvertising | Object): Promise<IAdvertising> {
        try {
            const advertising = await Advertising.findOneAndUpdate(query, payload, { new: true })

            if (!advertising) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'advertising_404')
            }

            return advertising
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async updateMany(query: Object, payload: IAdvertising | Object): Promise<Object> {
        try {
            const db_res = await Advertising.updateMany(query, payload)

            return db_res
        } catch (error) {
            logger.error(`${this.scope}.updateMany: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IAdvertising> {
        try {
            const advertising = await Advertising.findOneAndDelete(query)

            if (!advertising) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'advertising_404')
            }

            return advertising
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
