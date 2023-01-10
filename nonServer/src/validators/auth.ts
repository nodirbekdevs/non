import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class AuthValidator {
    private loginSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.loginSchema.validate(req.body)
        return error ? next(error) : next()
    })
}
