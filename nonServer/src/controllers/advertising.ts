import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'

export class AdvertisingController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const {lang} = res.locals, {title} = req.query

        let search = {}

        if (title) search = { title: new RegExp(`^${title}`, 'i') }

        const advertisements = await storage.advertising.find({ ...search })

        res.status(200).json({
            success: true,
            data: {
                advertisements
            },
            message: message('advertising_getAll_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        const advertising = await storage.advertising.findOne({ _id })

        res.status(200).json({
            success: true,
            data: {
                advertising
            },
            message: message('advertising_getOne_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals

        const advertising = await storage.advertising.create(req.body)

        res.status(201).json({
            success: true,
            data: {
                advertising
            },
            message: message('advertising_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id, {author} = req.body

        let advertising = await storage.advertising.findOne({_id})

        if (advertising.status === 'process' || advertising.status === 'approved') {
            return next(new AppError(403, 'advertising_403'))
        }

        const admin = await storage.admin.findOne({_id: author})

        if (advertising.author === 0 && author && admin) {
            await storage.advertising.updateMany({author: 0}, {author})
        }

        advertising = await storage.advertising.update({ _id }, req.body)

        res.status(200).json({
            success: true,
            data: {
                advertising
            },
            message: message('advertising_updated_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        let advertising = await storage.advertising.findOne({_id})

        if (advertising.status === 'process' || advertising.status === 'approved') {
            return next(new AppError(403, 'advertising_403'))
        }

        const admin = await storage.admin.findOne({_id: advertising.author})

        const index = admin.advertisements.indexOf(advertising._id)

        if (index > -1) {
            admin.advertisements.splice(index)
            admin.total_advertisements -= 1
            await admin.save()
        }

        await storage.advertising.delete({ _id })

        res.status(200).json({
            success: true,
            message: message('advertising_delete_200', lang)
        })
    })
}
