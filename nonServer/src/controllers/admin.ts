import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import { hash, genSalt } from 'bcrypt'
import { signToken } from '../middleware/auth'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class AdminController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, {telegram_id, name, username, number} = req.query

        const admin = await storage.admin.findOne({ _id: id })

        if (admin.type !== 'super_admin') {
            return next(new AppError(403, 'admin_403'))
        }

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

        const admins = await storage.admin.find({ ...search })

        res.status(200).json({
            success: true,
            data: {
                admins
            },
            message: message('admin_getAll_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, _id = req.params.id

        let admin = await storage.admin.findOne({ _id: id })

        if (admin.type === 'admin' && id !== _id) {
            return next(new AppError(403, 'admin_403'))
        }

        admin = await storage.admin.findOne({ _id })

        res.status(200).json({
            success: true,
            data: {
                admin
            },
            message: message('admin_getOne_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let password
        const { lang, id } = res.locals, {username} = req.body

        let admin = await storage.admin.findOne({ _id: id })

        if (admin.type !== 'super_admin') {
            return next(new AppError(403, 'admin_403'))
        }

        const salt = await genSalt()
        password = await hash(username, salt)

        admin = await storage.admin.create({ password, ...req.body })

        res.status(201).json({
            success: true,
            data: {
                admin
            },
            message: message('admin_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, _id = req.params.id, {username, branch} = req.body

        let admin = await storage.admin.findOne({ _id: id })

        const products = admin.products, advertisements = admin.advertisements

        if (admin.type === 'admin' && id !== _id) {
            return next(new AppError(403, 'admin_403'))
        }

        if (username) {
            const salt = await genSalt()
            req.body.password = await hash(username, salt)
        }

        if (products.length > 0) {
            for (let i = 0; i < products.length; i++) {
                const product = await storage.product.findOne({_id: products[i]})

                if (product.status === 'process') {
                    return next(new AppError(403, 'admin_403'))
                }
            }
        }

        if (advertisements.length > 0) {
            for (let i = 0; i < advertisements.length; i++) {
                const advertising = await storage.advertising.findOne({_id: advertisements[i]})

                if (advertising.status === 'process') {
                    return next(new AppError(403, 'admin_403'))
                }
            }
        }

        if (branch && admin.branch !== branch) {
            const exist_branch = await storage.branch.findOne({_id: branch})

            if (exist_branch.admin) {
                await storage.branch.update({_id: exist_branch._id}, {admin: 0})
            }

            await storage.branch.update({_id: admin.branch}, {admin: 0})

            await storage.branch.update({_id: exist_branch._id}, {admin: admin.telegram_id})
        }

        admin = await storage.admin.update({ _id }, req.body)

        res.status(200).json({
            success: true,
            data: {
                admin
            },
            message: message('admin_updated_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id, lang } = res.locals, _id = req.params.id

        let admin = await storage.admin.findOne({ _id: id })

        const products = admin.products, advertisements = admin.advertisements

        if (admin.type !== 'super_admin' || id === _id) {
            return next(new AppError(403, 'admin_403'))
        }

        const deleted_admin = await storage.admin.findOne({_id})

        if (products.length > 0) {
            for (let i = 0; i < products.length; i++) {
                const product = await storage.product.findOne({_id: products[i]})

                if (product.status === 'process') {
                    return next(new AppError(403, 'admin_403'))
                }
            }
        }

        if (advertisements.length > 0) {
            for (let i = 0; i < advertisements.length; i++) {
                const advertising = await storage.advertising.findOne({_id: advertisements[i]})

                if (advertising.status === 'process') {
                    return next(new AppError(403, 'admin_403'))
                }
            }
        }

        if (deleted_admin.branch) {
            await storage.branch.update({_id: deleted_admin.branch}, {admin: 0})
        }

        if (deleted_admin.advertisements.length && deleted_admin.total_advertisements > 0) {
            await storage.advertising.updateMany({author: deleted_admin.telegram_id}, {author: 0})
        }

        if (deleted_admin.products.length && deleted_admin.total_products > 0) {
            await storage.product.updateMany({author: deleted_admin.telegram_id}, {author: 0})
        }

        await storage.admin.delete({ _id })

        res.status(200).json({
            success: true,
            message: message('admin_delete_200', lang)
        })
    })

    createSuperAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { username } = req.body

        const salt = await genSalt()
        const hashed_password = await hash(username, salt)

        const admin = await storage.admin.create({
            ...req.body,
            password: hashed_password,
            type: 'super_admin'
        })

        const token = await signToken(admin.id, 'admin')

        res.status(201).json({
            success: true,
            data: {
                admin,
                token
            }
        })
    })
}
