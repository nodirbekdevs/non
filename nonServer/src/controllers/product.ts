import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class ProductController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const {lang} = res.locals, {product_name} = req.query

        let search = {}

        if (product_name) {
            search = { name: new RegExp(`^${product_name}`, 'i') }
        }

        const products = await storage.product.find({ ...search })

        res.status(200).send({
            success: true,
            data: {
                products
            },
            message: message('product_getAll_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        const product = await storage.product.findOne({ _id })

        res.status(200).send({
            success: true,
            data: {
                product
            },
            message: message('product_getOne_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, admin = await storage.admin.findOne({_id: id})

        const product = await storage.product.create({ author: admin.telegram_id, ...req.body })

        res.status(201).send({
            success: true,
            data: {
                product
            },
            message: message('product_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id, {status, author} = req.body

        let product = await storage.product.findOne({_id})

        const orders = await storage.order.find({}), admin = await storage.admin.findOne({_id: author})

        if (product.status === 'process') {
            return next(new AppError(403, 'product_403'))
        }

        if (orders.length > 0) {
            orders.map(async order => {
                if (
                    order.status === 'process' || order.status === 'active' ||
                    order.status === 'approved' || order.status === 'out_of_delivery'
                ) {
                    const items = order.items
                    for (let i = 0; i < items.length; i++) {
                        const item = await storage.item.findOne({_id: items[i]})

                        if (item.product === product.product_name) {
                            return next(new AppError(403, 'product_403'))
                        }
                    }
                }
            })
        }

        if (status === 'inactive') {
            const users = await storage.user.find({status: 'active'})

            users.map(async user => {
                const index = user.liked_products.indexOf(product._id)

                if (index > -1) {
                    user.liked_products.splice(index)
                    user.total_liked_products -= 1
                    await user.save()
                }
            })
        }

        if (product.author === 0 && author && admin) {
            await storage.product.updateMany({author: 0}, {author})
        }

        product = await storage.product.update({ _id }, req.body)

        res.status(200).send({
            success: true,
            data: {
                product
            },
            message: message('product_updated_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        const product = await storage.product.findOne({_id}),
            orders = await storage.order.find({}),
            users = await storage.user.find({status: 'active'})

        if (product.status === 'process') {
            return next(new AppError(403, 'product_403'))
        }

        if (orders.length > 0) {
            orders.map(async order => {
                if (
                    order.status === 'process' || order.status === 'active' ||
                    order.status === 'approved' || order.status === 'out_of_delivery'
                ) {
                    const items = order.items
                    for (let i = 0; i < items.length; i++) {
                        const item = await storage.item.findOne({_id: items[i]})

                        if (item.product === product.product_name) {
                            return next(new AppError(403, 'product_403'))
                        }
                    }
                }

            })
        }

        users.map(async user => {
            const index = user.liked_products.indexOf(product._id)

            if (index > -1) {
                user.liked_products.splice(index)
                user.total_liked_products -= 1
                await user.save()
            }
        })

        await storage.product.delete({ _id })

        res.status(200).send({
            success: true,
            message: message('product_delete_200', lang)
        })
    })
}
