import { OrderRepository } from '../repo/order'
import Order, { IOrder } from '../../models/Order'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class OrderStorage implements OrderRepository {
    private scope = 'storage.order'

    async find(query: Object): Promise<IOrder[]> {
        try {
            const orders = Order.find(query)

            return orders
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IOrder> {
        try {
            const order = await Order.findOne(query)

            if (!order) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'order_404')
            }

            return order
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IOrder): Promise<IOrder> {
        try {
            const order = await Order.create(payload)

            return order
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: IOrder | Object): Promise<IOrder> {
        try {
            const order = await Order.findOneAndUpdate(query, payload, { new: true })

            if (!order) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'order_404')
            }

            return order
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IOrder> {
        try {
            const order = await Order.findOneAndDelete(query)

            if (!order) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'order_404')
            }

            return order
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
