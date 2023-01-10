import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import catchAsync from '../utils/catchAsync'

export class FeedbackValidator {
    // private createSchema = Joi.object({
    //     author: Joi.number().integer(),
    //     is_employee: Joi.boolean(),
    //     title: Joi.string(),
    //     description: Joi.string(),
    //     action: Joi.string(),
    //     step: Joi.number().integer(),
    //     status: Joi.string().valid('process', 'inactive', 'active', 'approved')
    // })
    //
    // private updateSchema = Joi.object({
    //     author: Joi.number().integer(),
    //     is_employee: Joi.boolean(),
    //     title: Joi.string(),
    //     description: Joi.string(),
    //     action: Joi.string(),
    //     step: Joi.number().integer(),
    //     status: Joi.string().valid('process', 'inactive', 'active', 'approved')
    // })

    private validate = Joi.object({
        author: Joi.number().integer(),
        branch: Joi.string(),
        is_employee: Joi.boolean(),
        mark: Joi.string(),
        description: Joi.string(),
        action: Joi.string(),
        step: Joi.number().integer(),
        status: Joi.string().valid('process', 'inactive', 'active', 'approved')
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.validate.validate(req.body)
        return error ? next(error) : next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.validate.validate(req.body)
        return error ? next(error) : next()
    })
}
