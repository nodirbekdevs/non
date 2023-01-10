import { ProductRepository } from '../repo/product'
import Product , { IProduct } from '../../models/Product'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class ProductStorage implements ProductRepository {
    private scope = 'storage.product'

    async find(query: Object): Promise<IProduct[]> {
        try {
            const products = await Product.find(query)

            return products
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IProduct> {
        try {
            const product = await Product.findOne(query)

            if (!product) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'product_404')
            }

            return product
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IProduct): Promise<IProduct> {
        try {
            const product = await Product.create(payload)

            return product
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: IProduct | Object): Promise<IProduct> {
        try {
            const product = await Product.findOneAndUpdate(query, payload, { new: true })

            if (!product) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'product_404')
            }

            return product
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async updateMany(query: Object, payload: IProduct | Object): Promise<Object> {
        try {
            const db_res = await Product.updateMany(query, payload)

            return db_res
        } catch (error) {
            logger.error(`${this.scope}.updateMany: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IProduct> {
        try {
            const product = await Product.findOneAndDelete(query)

            if (!product) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'product_404')
            }

            return product
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
