import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import { compare } from 'bcrypt'
import { signToken } from '../middleware/auth'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'

export class AuthController {
    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let response, type!: string, token
        const { lang } = res.locals, { username, password } = req.body

        const admin = (await storage.admin.find({ username }))[0]
        const user = (await storage.user.find({ username }))[0]
        const employee = (await storage.employee.find({ username }))[0]

        if (admin) {
            response = admin
            type = 'admin'
        } else if (user) {
            response = user
            type = 'user'
        } else if (employee) {
            response = employee
            type = 'employee'
        }

        if (response && response.status === 'active' && (await compare(password, response.password))) {
            token = await signToken(response._id, type)
        } else {
            return next(new AppError(403, 'auth_403'))
        }

        res.status(200).json({
            success: true,
            data: {
                response,
                type,
                token
            },
            message: message(`${type}_loggedIn_200`, lang)
        })
    })

    profile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let profile
        const { lang, id, role } = res.locals

        if (role === 'admin') {
            profile = await storage.admin.findOne({_id: id})
        } else if (role === 'user') {
            profile = await storage.user.findOne({_id: id})
        } else if (role === 'employee') {
            profile = await storage.employee.findOne({_id: id})
        }

        res.status(200).json({
            success: true,
            data: {
                profile,
                main_type: role,
            },
            message: message(`${role}_loggedIn_200`, lang)
        })
    })
}
