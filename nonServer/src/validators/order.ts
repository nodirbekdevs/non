import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import catchAsync from '../utils/catchAsync'
import { kernel } from 'sharp'

export class OrderValidator {
    // private createSchema = Joi.object({
    //      admin: Joi.number().integer().required(),
    //      author: Joi.number().integer().required(),
    //      supplier: Joi.number().integer().required(),
    //      items: Joi.array().items(Joi.string().required()).required(),
    //      total_items: Joi.number().integer().required(),
    //      price: Joi.number().integer().required(),
    //      date: Joi.string().required(),
    //      time: Joi.string().required(),
    //      should_deliver: Joi.boolean().required(),
    //      location: Joi.object({
    //          name: Joi.string().required(),
    //          latitude: Joi.string().required(),
    //          longitude: Joi.string().required()
    //      }).required(),
    //      signature: Joi.string()..required(),
    //      step: Joi.number().integer().required(),
    //      attempt: Joi.number().integer().required(),
    //      status: Joi.string().valid('process', 'completed', 'mistake').required()
    // })
    //
    // private updateSchema = Joi.object({
    //     admin: Joi.number().integer(),
    //     author: Joi.number().integer(),
    //     supplier: Joi.number().integer(),
    //     items: Joi.array().items(Joi.string()),
    //     total_items: Joi.number().integer(),
    //     price: Joi.number().integer(),
    //     date: Joi.string(),
    //     time: Joi.string(),
    //     should_deliver: Joi.boolean(),
    //     location: Joi.object({
    //         name: Joi.string(),
    //         latitude: Joi.string(),
    //         longitude: Joi.string()
    //     }),
    //     signature: Joi.string(),
    //     step: Joi.number().integer(),
    //     attempt: Joi.number().integer(),
    //     status: Joi.string().valid('process', 'completed', 'mistake')
    // })

    private validate = Joi.object({
        admin: Joi.number().integer(),
        author: Joi.number().integer(),
        supplier: Joi.number().integer(),
        branch: Joi.string(),
        items: Joi.array().items(Joi.string()),
        total_items: Joi.number().integer(),
        price: Joi.number().integer(),
        date: Joi.string(),
        time: Joi.string(),
        should_deliver: Joi.boolean(),
        location: Joi.object({
            name: Joi.string(),
            latitude: Joi.string(),
            longitude: Joi.string()
        }),
        signature: Joi.string(),
        step: Joi.number().integer(),
        attempt: Joi.number().integer(),
        status: Joi.string().valid('process', 'inactive', 'active', 'accepted')
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
