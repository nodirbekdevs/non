import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'

export class FeedbackController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const {lang} = res.locals, {title} = req.query

        let search = {}

        if (title) search = { title: new RegExp(`^${title}`, 'i') }

        const feedback = await storage.feedback.find({ ...search })

        res.status(200).json({
            success: true,
            data: {
                feedback
            },
            message: message('feedback_getAll_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        const feedback = await storage.feedback.findOne({ _id })

        await storage.feedback.update({ _id }, {is_read: true})

        res.status(200).json({
            success: true,
            data: {
                feedback
            },
            message: message('feedback_getOne_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals

        const feedback = await storage.feedback.create(req.body)

        if (feedback.branch !== '') {
            const branch = await storage.branch.findOne({_id: feedback.branch})

            branch.feedback.push(feedback._id)
            branch.total_feedback += 1
            await branch.save()
        }

        res.status(201).json({
            success: true,
            data: {
                feedback
            },
            message: message('feedback_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        let feedback = await storage.feedback.findOne({_id})

        if (feedback.status === 'process') {
            return next(new AppError(403, 'feedback_403'))
        }

        feedback = await storage.feedback.update({ _id }, req.body)

        res.status(200).json({
            success: true,
            data: {
                feedback
            },
            message: message('feedback_updated_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals, _id = req.params.id

        const feedback = await storage.feedback.findOne({_id})

        const response = await storage.user.findOne({telegram_id: feedback.author})
            ? await storage.user.findOne({telegram_id: feedback.author})
            : await storage.employee.findOne({telegram_id: feedback.author})

        if (feedback.status === 'process' || feedback.action === 'seen' || feedback.action === 'done') {
            return next(new AppError(403, 'feedback_403'))
        }

        if (response) {
            const index = response.feedback.indexOf(feedback._id)

            if (index > -1) {
                response.feedback.splice(index)
                response.total_feedback -= 1
                await response.save()
            }
        }

        await storage.feedback.delete({ _id })

        res.status(200).json({
            success: true,
            message: message('feedback_delete_200', lang)
        })
    })
}
