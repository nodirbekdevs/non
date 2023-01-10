import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import catchAsync from '../utils/catchAsync'

export class ItemValidator {
    // private createSchema = Joi.object({
    //     author: Joi.number().integer().required(),
    //     product: Joi.string().required(),
    //     quantity: Joi.number().integer().required(),
    //     price: Joi.number().integer().required(),
    //     step: Joi.number().integer().required(),
    //     status: Joi.string().valid('process', 'completed', 'mistake').required()
    // })
    //
    // private updateSchema = Joi.object({
    //     author: Joi.number().integer(),
    //     product: Joi.string(),
    //     quantity: Joi.number().integer(),
    //     price: Joi.number().integer(),
    //     step: Joi.number().integer(),
    //     status: Joi.string().valid('process', 'completed', 'mistake')
    // })

    private validate = Joi.object({
        author: Joi.number().integer(),
        product: Joi.string(),
        quantity: Joi.number().integer(),
        price: Joi.number().integer(),
        situation: Joi.string(),
        step: Joi.number().integer(),
        status: Joi.string().valid('process', 'inactive', 'active')
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
