import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import catchAsync from '../utils/catchAsync'

export class EmployeeValidator {
    // private createSchema = Joi.object({
    //     telegram_id: Joi.number().integer(),
    //     admin: Joi.number().integer(),
    //     name: Joi.string(),
    //     username: Joi.string(),
    //     password: Joi.string(),
    //     number: Joi.string(),
    //     orders: Joi.array().items(Joi.string()),
    //     feedback: Joi.array().items(Joi.string()),
    //     total_orders: Joi.number().integer(),
    //     total_feedback: Joi.number().integer(),
    //     num_of_delivered_product: Joi.number().integer(),
    //     is_idler: Joi.boolean(),
    //     step: Joi.number().integer(),
    //     status: Joi.string().valid('process','completed')
    // })
    //
    // private updateSchema = Joi.object({
    //     telegram_id: Joi.number().integer(),
    //     admin: Joi.number().integer(),
    //     name: Joi.string(),
    //     username: Joi.string(),
    //     password: Joi.string(),
    //     number: Joi.string(),
    //     orders: Joi.array().items(Joi.string()),
    //     feedback: Joi.array().items(Joi.string()),
    //     total_orders: Joi.number().integer(),
    //     total_feedback: Joi.number().integer(),
    //     num_of_delivered_product: Joi.number().integer(),
    //     is_idler: Joi.boolean(),
    //     step: Joi.number().integer(),
    //     status: Joi.string().valid('process','completed')
    // })

    private validate = Joi.object({
        telegram_id: Joi.number().integer(),
        admin: Joi.number().integer(),
        branch: Joi.string(),
        name: Joi.string(),
        username: Joi.string(),
        password: Joi.string(),
        number: Joi.string(),
        orders: Joi.array().items(Joi.string()),
        feedback: Joi.array().items(Joi.string()),
        total_orders: Joi.number().integer(),
        total_feedback: Joi.number().integer(),
        num_of_delivered_product: Joi.number().integer(),
        task: Joi.string().valid('Nonvoy', 'Xamirchi', 'Yetkazib beruvchi'),
        is_idler: Joi.boolean(),
        step: Joi.number().integer(),
        status: Joi.string().valid('process','active')
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
