import { Router } from 'express'
import { AnalyticsController } from '../controllers/analytics'
import { AuthMiddleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new AnalyticsController()
const middleware = new AuthMiddleware()

router.route('/all').get(middleware.auth(['admin']), controller.analytics)

export default router
