import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import catchAsync from '../utils/catchAsync'

export class BranchValidator {
    // private createSchema = Joi.object({
    //      admin: Joi.number().integer(),
    //         name: Joi.string(),
    //         image: Joi.string(),
    //         location: Joi.object({
    //             name: Joi.string(),
    //             latitude: Joi.string(),
    //             longitude: Joi.string()
    //         }),
    //         total_employees: Joi.number().integer(),
    //         total_orders: Joi.number().integer(),
    //         step: Joi.number().integer(),
    //         status: Joi.string().valid('process', 'inactive', 'active')
    // })
    //
    // private updateSchema = Joi.object({
    //     admin: Joi.number().integer(),
    //         name: Joi.string(),
    //         image: Joi.string(),
    //         location: Joi.object({
    //             name: Joi.string(),
    //             latitude: Joi.string(),
    //             longitude: Joi.string()
    //         }),
    //         total_employees: Joi.number().integer(),
    //         total_orders: Joi.number().integer(),
    //         step: Joi.number().integer(),
    //         status: Joi.string().valid('process', 'inactive', 'active')
    // })

    private validate = Joi.object({
        admin: Joi.number().integer(),
        name: Joi.string(),
        image: Joi.string(),
        location: Joi.object({
            name: Joi.string(),
            latitude: Joi.string(),
            longitude: Joi.string()
        }),
        total_employees: Joi.number().integer(),
        total_orders: Joi.number().integer(),
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
