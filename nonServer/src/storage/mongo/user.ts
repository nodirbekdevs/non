import { UserRepository } from '../repo/user'
import User, { IUser } from '../../models/User'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class UserStorage implements UserRepository {
    private scope = 'storage.user'

    async find(query: Object): Promise<IUser[]> {
        try {
            const users = await User.find(query)

            return users
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IUser> {
        try {
            const user = await User.findOne(query)

            if (!user) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'user_404')
            }

            return user
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IUser): Promise<IUser> {
        try {
            const user = await User.create(payload)

            return user
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: IUser | Object): Promise<IUser> {
        try {
            const user = await User.findOneAndUpdate(query, payload, { new: true })

            if (!user) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'user_404')
            }

            return user
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IUser> {
        try {
            const user = await User.findOneAndDelete(query)

            if (!user) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'user_404')
            }

            return user
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
