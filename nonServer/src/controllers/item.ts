import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class ItemController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const {lang} = res.locals

        const items = await storage.item.find(req.query)

        res.status(200).json({
            success: true,
            data: {
                items
            },
            message: message('item_getAll_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        const item = await storage.item.findOne({ _id })

        res.status(200).json({
            success: true,
            data: {
                item
            },
            message: message('item_getOne_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals

        const item = await storage.item.create(req.body)

        res.status(201).json({
            success: true,
            data: {
                item
            },
            message: message('item_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        let item = await storage.item.findOne({_id})

        if (item.status === 'process') {
            return next(new AppError(403, 'item_403'))
        }

        item = await storage.item.update({ _id }, req.body)

        res.status(200).json({
            success: true,
            data: {
                item
            },
            message: message('item_updated_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        let item = await storage.item.findOne({_id})

        if (item.status === 'process') {
            return next(new AppError(403, 'item_403'))
        }

        const orders = await storage.order.find({})

        orders.map(async order => {
            if (order.items.includes(item._id)) {
                if (
                    order.status === 'process' || order.status === 'inactive' ||
                    order.status === 'approved' || order.status === 'out_of_delivery' ||
                    order.status === 'delivered' || order.status === 'accepted'
                ) {
                    return next(new AppError(403, 'item_403'))
                } else {
                    const index = order.items.indexOf(item._id)
                    if (index > -1) {
                        order.items.splice(index)
                        order.total_items -= 1
                        await order.save()
                    }
                }
            }
        })

        if (item.order) {
            const order = await storage.order.findOne({_id: item.order})

            const index = order.items.indexOf(item._id)

            if (index > -1) {
                order.items.splice(index)
                order.total_items -= 1
                await order.save()
            }
        }

        await storage.item.delete({ _id })

        res.status(200).json({
            success: true,
            message: message('item_delete_200', lang)
        })
    })
}
