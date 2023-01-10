import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import catchAsync from '../utils/catchAsync'

export class WorkValidator {
    // private createSchema = Joi.object({
    //     telegram_id: Joi.number().integer(),
    //     name: Joi.string(),
    //     username: Joi.string(),
    //     password: Joi.string(),
    //     number: Joi.string(),
    //     feedback: Joi.array().items(Joi.string()),
    //     orders: Joi.array().items(Joi.string()),
    //     liked_products: Joi.array().items(Joi.string()),
    //     total_feedback: Joi.number().integer(),
    //     total_orders: Joi.number().integer(),
    //     total_liked_products: Joi.number().integer(),
    //     num_of_bought: Joi.number().integer(),
    //     lang: Joi.string(),
    //     step: Joi.number().integer(),
    //     status: Joi.string().valid('process','completed')
    // })
    //
    // private updateSchema = Joi.object({
    //     telegram_id: Joi.number().integer(),
    //     name: Joi.string(),
    //     username: Joi.string(),
    //     password: Joi.string(),
    //     number: Joi.string(),
    //     feedback: Joi.array().items(Joi.string()),
    //     orders: Joi.array().items(Joi.string()),
    //     liked_products: Joi.array().items(Joi.string()),
    //     total_feedback: Joi.number().integer(),
    //     total_orders: Joi.number().integer(),
    //     total_liked_products: Joi.number().integer(),
    //     num_of_bought: Joi.number().integer(),
    //     lang: Joi.string(),
    //     step: Joi.number().integer(),
    //     status: Joi.string().valid('process','completed')
    // })

    private validate = Joi.object({
        type: Joi.string().valid('On', 'Off').when('status', {
            is: 'inactive',
            then: Joi.forbidden()
        }),
        description: Joi.string().when('type', {
            is: 'On' || Joi.forbidden(),
            then: Joi.forbidden(),
            otherwise: Joi.required()
        }),
        status: Joi.string().valid('active','inactive')
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
