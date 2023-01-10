import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import { hash, genSalt } from 'bcrypt'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class EmployeeController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, {telegram_id, name, username, number} = req.query

        let search = {}

        if (telegram_id) {
            search = { $where: `/^${telegram_id}.*/.test(this.telegram_id)` }
        } else if (name) {
            search = { name: new RegExp(`^${name}`, 'i') }
        } else if (username) {
            search = { username: new RegExp(`^${username}`, 'i') }
        } else if (number) {
            search = { number: new RegExp(`^${number}`, 'i') }
        }

        const employees = await storage.employee.find({...search})

        res.status(200).json({
            success: true,
            data: {
                employees
            },
            message: message('employee_getAll_200', lang)
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
            message: message('employee_getOne_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // let exist_branch, admin
        const { lang, id } = res.locals, {username, branch} = req.body

        if (username) {
            const salt = await genSalt()
            req.body.password = await hash(req.body.password, salt)
        }

        // if (branch) {
        //     exist_branch = await storage.branch.findOne({_id: branch})
        //     admin = await storage.admin.findOne({telegram_id: exist_branch.admin})
        // }

        const admin = await storage.admin.findOne({_id: id})

        const employee = await storage.employee.create({ admin: admin.telegram_id, ...req.body })

        if (employee.branch !== '') {
            const other_branch = await storage.branch.findOne({_id: employee.branch})

            other_branch.employees.push(employee._id)
            other_branch.total_employees += 1
            await other_branch.save()
        }

        // const employee = await storage.employee.create({ admin: admin.telegram_id, branch: branch._id, ...req.body })

        res.status(201).json({
            success: true,
            data: {
                employee
            },
            message: message('employee_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, _id = req.params.id, {status} = req.body

        let employee = await storage.employee.findOne({_id}),
            orders = await storage.order.find({supplier: employee.telegram_id})

        if (employee.is_idler) {
            return next(new AppError(403, 'employee_403'))
        }

        if (orders) {
            orders.map(order => {
                if (order.status !== 'delivered') {
                    return next(new AppError(403, 'employee_403'))
                }
            })
        }

        if (employee.feedback.length) {
            employee.feedback.map(async feedback => {
                const f = await storage.feedback.findOne({_id: feedback})

                if (f.status === 'process') {
                    return next(new AppError(403, 'employee_403'))
                }
            })
        }

        employee = await storage.employee.update({ _id }, req.body)

        res.status(200).json({
            success: true,
            data: {
                employee
            },
            message: message('employee_updated_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, _id = req.params.id

        let employee = await storage.employee.findOne({ _id: id }),
            orders = await storage.order.find({supplier: employee.telegram_id})

        if (employee.is_idler) {
            return next(new AppError(403, 'employee_403'))
        }

        if (orders) {
            orders.map(order => {
                if (order.status !== 'delivered') {
                    return next(new AppError(403, 'employee_403'))
                }
            })
        }

        if (employee.feedback.length) {
            employee.feedback.map(async feedback => {
                const f = await storage.feedback.findOne({_id: feedback})

                if (f.status === 'process') {
                    return next(new AppError(403, 'employee_403'))
                }
            })
        }

        if (employee.branch) {
            const branch = await storage.branch.findOne({_id: employee.branch})

            const index = branch.employees.indexOf(employee._id)
            if (index > -1) {
                branch.employees.splice(index)
                branch.total_employees -= 1
                await branch.save()
            }
        }

        await storage.employee.delete({ _id })

        res.status(200).json({
            success: true,
            message: message('employee_delete_200', lang)
        })
    })
}
