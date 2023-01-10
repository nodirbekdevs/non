import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class BranchController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, { name, total_employees, total_orders } = req.query

        let search = {}

        if (total_employees) {
            search = { $where: `/^${total_employees}.*/.test(this.total_employees)` }
        } else if (name) {
            search = { name: new RegExp(`^${name}`, 'i') }
        } else if (total_orders) {
            search = { $where: `/^${total_orders}.*/.test(this.total_orders)` }
        }

        const employees = await storage.employee.find({ ...search })

        res.status(200).json({
            success: true,
            data: {
                employees
            },
            message: message('branch_getAll_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        const employee = await storage.employee.findOne({ _id })

        res.status(200).json({
            success: true,
            data: {
                employee
            },
            message: message('branch_getOne_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, { admin } = req.body

        if (admin) {
            await storage.branch.update({admin: admin}, {admin: ''})
        }

        const branch = await storage.branch.create({ admin: admin.telegram_id, ...req.body })

        await storage.admin.update({ _id: admin }, { branch: branch._id })

        res.status(201).json({
            success: true,
            data: {
                branch
            },
            message: message('branch_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, _id = req.params.id, { admin, status } = req.body

        let branch = await storage.branch.findOne({ _id })

        if (branch.status === 'process') {
            return next(new AppError(403, 'branch_403'))
        }

        const orders = await storage.order.find({}),
            feedback = await storage.feedback.find({})

        if (orders.length > 0) {
            orders.map(order => {
                if (order.branch === branch.name && order.status === 'process') {
                    return next(new AppError(403, 'branch_403'))
                }
            })
        }

        if (feedback.length > 0) {
            feedback.map(f => {
                if (f.branch === branch.name && f.status === 'process') {
                    return next(new AppError(403, 'branch_403'))
                }
            })
        }

        if (admin && branch.admin !== admin) {
            const exist_admin = await storage.admin.findOne({telegram_id: admin})

            if (exist_admin.branch) {
                await storage.admin.update({_id: exist_admin._id}, {branch: ''})
            }

            await storage.admin.update({ _id: exist_admin._id }, { branch: branch._id })

            await storage.admin.update({ telegram_id: branch.admin }, { branch: '' })
        }

        if (status === 'inactive') {
            if (branch.employees.length > 0) {
                await storage.employee.updateMany({branch: branch._id}, {branch: '', status: 'inactive'})
            }

            await storage.admin.update({telegram_id: branch.admin}, {status: 'inactive'})
        }

        branch = await storage.branch.update({ _id }, req.body)

        res.status(200).json({
            success: true,
            data: {
                branch
            },
            message: message('branch_updated_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, _id = req.params.id

        const branch = await storage.branch.findOne({ _id }), orders = await storage.order.find({}),
            feedback = await storage.feedback.find({})

        if (branch.status === 'process') {
            return next(new AppError(403, 'branch_403'))
        }

        if (orders.length > 0) {
            orders.map(order => {
                if (order.branch === branch.name && order.status === 'process') {
                    return next(new AppError(403, 'branch_403'))
                }
            })
        }

        if (feedback.length > 0) {
            feedback.map(f => {
                if (f.branch === branch.name && f.status === 'process') {
                    return next(new AppError(403, 'branch_403'))
                }
            })
        }

        if (branch.admin) {
            await storage.admin.update({ telegram_id: branch.admin }, { branch: '' })
        }

        if (branch.employees.length > 0) {
            await storage.employee.updateMany({branch: branch._id}, {branch: '', status: 'inactive'})
        }

        await storage.employee.delete({ _id })

        res.status(200).json({
            success: true,
            message: message('branch_delete_200', lang)
        })
    })
}
