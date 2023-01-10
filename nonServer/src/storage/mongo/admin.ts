import { AdminRepository } from '../repo/admin'
import Admin, { IAdmin } from '../../models/Admin'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class AdminStorage implements AdminRepository {
    private scope = 'storage.admin'

    async find(query: Object): Promise<IAdmin[]> {
        try {
            const admins = await Admin.find(query)

            return admins
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IAdmin> {
        try {
            const admin = await Admin.findOne(query)

            if (!admin) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'admin_404')
            }

            return admin
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IAdmin): Promise<IAdmin> {
        try {
            const admin = await Admin.create(payload)

            return admin
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: IAdmin | Object): Promise<IAdmin> {
        try {
            const admin = await Admin.findOneAndUpdate(query, payload, { new: true })

            if (!admin) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'admin_404')
            }

            return admin
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IAdmin> {
        try {
            const admin = await Admin.findOneAndDelete(query)

            if (!admin) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'admin_404')
            }

            return admin
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
