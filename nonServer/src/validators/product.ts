import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import catchAsync from '../utils/catchAsync'

export class ProductValidator {
    // private createSchema = Joi.object({
    //     author: Joi.number().integer().required(),
    //     image: Joi.string().required(),
    //     name: Joi.string().required(),
    //     description: Joi.string().required(),
    //     rating: Joi.array().items(Joi.number().required()).required(),
    //     num_of_sold: Joi.number().integer().required(),
    //     price: Joi.number().integer().required(),
    //     step: Joi.number().integer().required(),
    //     status: Joi.string().valid('process', 'completed', 'mistake').required()
    // })
    //
    // private updateSchema = Joi.object({
    //     author: Joi.number().integer(),
    //     image: Joi.string(),
    //     name: Joi.string(),
    //     description: Joi.string(),
    //     rating: Joi.array().items(Joi.number()),
    //     num_of_sold: Joi.number().integer(),
    //     price: Joi.number().integer(),
    //     step: Joi.number().integer(),
    //     status: Joi.string().valid('process', 'completed', 'mistake')
    // })

    private validate = Joi.object({
        author: Joi.number().integer(),
        image: Joi.string(),
        product_name: Joi.string(),
        description: Joi.string(),
        rating: Joi.array().items(Joi.number()),
        num_of_sold: Joi.number().integer(),
        price: Joi.number().integer(),
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
