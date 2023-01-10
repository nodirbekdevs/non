import { Router } from 'express'
import { AdvertisingController } from '../controllers/advertising'
import { AdvertisingValidator } from '../validators/advertising'
import { AuthMiddleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new AdvertisingController()
const validator = new AdvertisingValidator()
const middleware = new AuthMiddleware()

router.route('/all').get(middleware.auth(['admin']), controller.getAll)
router.route('/create').post(middleware.auth(['admin']), validator.create, controller.create)
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
    .patch(middleware.auth(['admin']), validator.update, controller.update)
    .delete(middleware.auth(['admin']), controller.delete)

export default router
