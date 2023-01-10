import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class OrderController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, { start, end, supplier, admin, author } = req.query

        let search: any = {}

        if (start) {
            search = { created_at: { $gte: start } }
        } else if (end) {
            if (!search.created_at) {
                search = { created_at: {} }
            }

            search = { created_at: { $lte: end } }
        } else if (supplier) {
            search = { $where: `/^${supplier}.*/.test(this.supplier)` }
        } else if (admin) {
            search = { $where: `/^${admin}.*/.test(this.admin)` }
        } else if (author) {
            search = { $where: `/^${author}.*/.test(this.author)` }
        }

        const orders = await storage.order.find(search)

        res.status(200).json({
            success: true,
            data: {
                orders
            },
            message: message('order_getAll_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        const order = await storage.order.findOne({ _id })

        res.status(200).json({
            success: true,
            data: {
                order
            },
            message: message('order_getOne_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // let exist_branch, admin
        const { lang } = res.locals
        // const { branch } = req.body
        //
        // if (branch) {
        //     exist_branch = await storage.branch.findOne({_id: branch})
        //     admin = await storage.admin.findOne({branch: branch._id})
        //     const order = await storage.order.create({branch: exist_branch._id, admin, ...req.body})
        // }

        const order = await storage.order.create(req.body)

        res.status(201).json({
            success: true,
            data: {
                order
            },
            message: message('order_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id, { status } = req.body

        let order = await storage.order.findOne({ _id })

        if (order) {
            if (order.status === 'process' || order.status === 'out_of_delivery') {
                return next(new AppError(403, 'order_403'))
            }

            if (status === 'inactive') {
                if (order.status === 'approved') {
                    await storage.employee.update({telegram_id: order.supplier}, { is_idler: false })
                }

                await storage.item.updateMany({order: order._id}, {status: 'inactive'})
            }

            if (status === 'accepted') {
                await storage.order.update({ _id }, {step: 13, attempt: 2, delivered_at: Date.now()})

                const items = order.items

                for (let i = 0; i < items.length; i++) {
                    const item = await storage.item.findOne({_id: items[i]})

                    await storage.item.update(items[i], {step: 6, status: 'accepted'})
                    await storage.product.update({product_name: item.product}, {$inc: {num_of_sold: item.quantity}})
                    await storage.user.update({telegram_id: order.author}, {$inc: {num_of_bought: item.quantity}})
                }
            }
        }

        order = await storage.order.update({ _id }, req.body)

        res.status(200).json({
            success: true,
            data: {
                order
            },
            message: message('order_updated_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        const order = await storage.order.findOne({ _id }),
            user = await storage.user.findOne({ telegram_id: order.author }), items = order.items

        if (order.status === 'process' || order.status === 'out_of_delivery') {
            return next(new AppError(403, 'order_403'))
        }

        for (let i = 0; i < items.length; i++) {
            await storage.item.delete({_id: items[i]})
        }

        if (order.status === 'approved') {
            await storage.employee.update({telegram_id: order.supplier}, { is_idler: false })
        }

        if (user) {
            const index = user.orders.indexOf(order._id)
            if (index > -1) {
                user.orders.splice(index)
                user.total_orders -= 1
                await user.save()
            }
        }

        await storage.order.delete({ _id })

        res.status(200).json({
            success: true,
            message: message('order_delete_200', lang)
        })
    })
}
