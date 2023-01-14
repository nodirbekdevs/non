import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class WorkController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals

        const works = await storage.work.find({})

        res.status(200).send({
            success: true,
            data: {
                works
            },
            message: message('work_getAll_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, _id = req.params.id

        const work = await storage.work.findOne({ _id })

        res.status(200).send({
            success: true,
            data: {
                work
            },
            message: message('work_getOne_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals

        const admin = await storage.admin.findOne({_id: id})

        if (admin.type !== 'super_admin') {
            return next(new AppError(403, 'work_403'))
        }

        let work = (await storage.work.find({}))[0]

        if (work && work.type && work.status === 'active') {
            return next(new AppError(403, 'work_403'))
        }

        work = await storage.work.create({ admin: admin.telegram_id, ...req.body })

        res.status(201).send({
            success: true,
            data: {
                work
            },
            message: message('work_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals, {type} = req.body

        let work = (await storage.work.find({}))[0]

        if (!work) {
            return next(new AppError(403, 'work_403'))
        }

        const admin = await storage.admin.findOne({_id: id}),
            orders = await storage.order.find({}),
            feedback = await storage.feedback.find({})

        if (admin.type !== 'super_admin' && admin.telegram_id !== work.admin) {
            return next(new AppError(403, 'work_403'))
        }

        if (type === 'Off') {
            if (orders.length > 0) {
                for (let i = 0; i < orders.length; i++) {
                    if (orders[i].status === 'process') {
                        return next(new AppError(403, 'work_403'))
                    }
                }
            }

            if (feedback.length > 0) {
                feedback.map(async feedback => {
                    if (feedback.status === 'process') {
                        return next(new AppError(403, 'work_403'))
                    }
                })
            }
        }

        if (type === "On") {
            await storage.work.update(work._id, {description: ""})
        }

        work = await storage.work.update({ _id: work._id }, req.body)

        res.status(200).json({
            success: true,
            data: {
                work
            },
            message: message('work_updated_200', lang)
        })
    })
}
