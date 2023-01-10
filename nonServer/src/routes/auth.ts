import { Router } from 'express'
import { AuthController } from '../controllers/auth'
import { AuthValidator } from '../validators/auth'
import { AuthMiddleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new AuthController()
const validator = new AuthValidator()
const middleware = new AuthMiddleware()

router.route('/login').post(validator.login, controller.login)
router.route('/profile').get(middleware.auth(['admin', 'employee', 'user']), controller.profile)

export default router
