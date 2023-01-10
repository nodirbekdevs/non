import { EmployeeRepository } from '../repo/employee'
import Employee , { IEmployee } from '../../models/Employee'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class EmployeeStorage implements EmployeeRepository {
    private scope = 'storage.employee'

    async find(query: Object): Promise<IEmployee[]> {
        try {
            const employees = await Employee.find(query)

            return employees
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IEmployee> {
        try {
            const employee = await Employee.findOne(query)

            if (!employee) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'employee_404')
            }

            return employee
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IEmployee): Promise<IEmployee> {
        try {
            const employee = await Employee.create(payload)

            return employee
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: IEmployee | Object): Promise<IEmployee> {
        try {
            const employee = await Employee.findOneAndUpdate(query, payload, { new: true })

            if (!employee) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'employee_404')
            }

            return employee
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async updateMany(query: Object, payload: IEmployee | Object): Promise<Object> {
        try {
            const db_res = await Employee.updateMany(query, payload)

            return db_res
        } catch (error) {
            logger.error(`${this.scope}.updateMany: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IEmployee> {
        try {
            const employee = await Employee.findOneAndDelete(query)

            if (!employee) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'employee_404')
            }

            return employee
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
