import { ItemRepository } from '../repo/item'
import Item, { IItem } from '../../models/Item'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class ItemStorage implements ItemRepository {
    private scope = 'storage.item'

    async find(query: Object): Promise<IItem[]> {
        try {
            const items = await Item.find(query)

            return items
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IItem> {
        try {
            const item = await Item.findOne(query)

            if (!item) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'item_404')
            }

            return item
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IItem): Promise<IItem> {
        try {
            const item = await Item.create(payload)

            return item
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: IItem | Object): Promise<IItem> {
        try {
            const item = await Item.findOneAndUpdate(query, payload, { new: true })

            if (!item) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'item_404')
            }

            return item
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async updateMany(query: Object, payload: IItem | Object): Promise<Object> {
        try {
            const db_res = await Item.updateMany(query, payload)

            return db_res
        } catch (error) {
            logger.error(`${this.scope}.updateMany: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IItem> {
        try {
            const item = await Item.findOneAndDelete(query)

            if (!item) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'item_404')
            }

            return item
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
