import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import catchAsync from '../utils/catchAsync'

export class AdvertisingValidator {
    // private createSchema = Joi.object({
    //     author: Joi.number().integer(),
    //     image: Joi.string(),
    //     title: Joi.string(),
    //     description: Joi.string(),
    //     step: Joi.number().integer(),
    //     status: Joi.string().valid('process', 'completed', 'mistake', 'approved')
    // })
    //
    // private updateSchema = Joi.object({
    //     author: Joi.number().integer(),
    //     image: Joi.string(),
    //     title: Joi.string(),
    //     description: Joi.string(),
    //     step: Joi.number().integer(),
    //     status: Joi.string().valid('process', 'completed', 'mistake', 'approved')
    // })

    private validate = Joi.object({
        author: Joi.number().integer(),
        image: Joi.string(),
        title: Joi.string(),
        description: Joi.string(),
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
