import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import catchAsync from '../utils/catchAsync'

export class AdminValidator {
    // private createSchema = Joi.object({
    //     telegram_id: Joi.number().integer().required(),
    //     name: Joi.string().required(),
    //     username: Joi.string().required(),
    //     password: Joi.string().required(),
    //     number: Joi.string().required(),
    //     advertising: Joi.array().items(Joi.string()).required(),
    //     products: Joi.array().items(Joi.string()).required(),
    //     total_advertising: Joi.number().integer().required(),
    //     total_products: Joi.number().integer().required(),
    //     step: Joi.number().integer().required(),
    //     type: Joi.string().valid('admin', 'super_admin').required()
    // })
    //
    // private updateSchema = Joi.object({
    //     telegram_id: Joi.number().integer(),
    //     name: Joi.string(),
    //     username: Joi.string(),
    //     password: Joi.string(),
    //     number: Joi.string(),
    //     advertising: Joi.array().items(Joi.string()),
    //     products: Joi.array().items(Joi.string()),
    //     total_advertising: Joi.number().integer(),
    //     total_products: Joi.number().integer(),
    //     step: Joi.number().integer(),
    //     type: Joi.string().valid('admin', 'super_admin')
    // })

    private validate = Joi.object({
        telegram_id: Joi.number().integer(),
        branch: Joi.string(),
        name: Joi.string(),
        username: Joi.string(),
        number: Joi.string(),
        advertisements: Joi.array().items(Joi.string()),
        products: Joi.array().items(Joi.string()),
        total_advertisements: Joi.number().integer(),
        total_products: Joi.number().integer(),
        step: Joi.number().integer(),
        type: Joi.string().valid('admin', 'super_admin')
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
