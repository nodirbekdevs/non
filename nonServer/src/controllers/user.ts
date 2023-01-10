import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import { hash, genSalt } from 'bcrypt'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class UserController {
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

        const users = await storage.user.find({...search})

        res.status(200).send({
            success: true,
            data: {
                users
            },
            message: message('user_getAll_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        const user = await storage.user.findOne({ _id })

        res.status(200).send({
            success: true,
            data: {
                user
            },
            message: message('user_getOne_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, {username} = req.body

        if (username) {
            const salt = await genSalt()
            req.body.password = await hash(req.body.password, salt)
        }

        const user = await storage.user.create(req.body)

        res.status(201).send({
            success: true,
            data: {
                user
            },
            message: message('user_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, _id = req.params.id

        let user = await storage.user.findOne({_id: id})

        if (user.orders.length) {
            user.orders.map(async order => {
                const o = await storage.order.findOne({_id: order})

                if (!o.should_deliver) {
                    if (o.status !== 'accepted') {
                        return next(new AppError(403, 'user_403'))
                    }
                }

                if (o.should_deliver) {
                    if (o.status === 'active' || o.status === 'approved' || o.status === 'out_of_delivery') {
                        return next(new AppError(403, 'user_403'))
                    }
                }
            })
        }

        if (user.feedback.length) {
            user.feedback.map(async feedback => {
                const f = await storage.feedback.findOne({_id: feedback})

                if (f.status === 'process') {
                    return next(new AppError(403, 'user_403'))
                }
            })
        }

        user = await storage.user.update({ _id }, req.body)

        res.status(200).send({
            success: true,
            data: {
                user
            },
            message: message('user_updated_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, _id = req.params.id

        let user = await storage.user.findOne({ _id: id })

        if (user.orders.length) {
            user.orders.map(async order => {
                const o = await storage.order.findOne({_id: order})

                if (!o.should_deliver) {
                    if (o.status !== 'accepted') {
                        return next(new AppError(403, 'user_403'))
                    }
                }

                if (o.should_deliver) {
                    if (o.status === 'acrive' || o.status === 'approved' || o.status === 'out_of_delivery') {
                        return next(new AppError(403, 'employee_403'))
                    }
                }
            })
        }

        if (user.feedback.length) {
            user.feedback.map(async feedback => {
                const f = await storage.feedback.findOne({_id: feedback})

                if (f.status === 'process') {
                    return next(new AppError(403, 'user_403'))
                }
            })
        }

        if (user.liked_products.length) {
            user.liked_products.map(async product => {
                const p = await storage.product.findOne({_id: product})

                const index = p.liked_users.indexOf(user._id)
                if (index > -1) {
                    p.liked_users.splice(index)
                    p.total_liked_users -= 1
                    await p.save()
                }
            })
        }

        await storage.user.delete({ _id })

        res.status(200).send({
            success: true,
            message: message('user_delete_200', lang)
        })
    })
}
