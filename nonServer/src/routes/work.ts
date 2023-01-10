import { Router } from 'express'
import { WorkController } from '../controllers/work'
import { WorkValidator} from '../validators/work'
import { AuthMiddleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new WorkController()
const validator = new WorkValidator()
const middleware = new AuthMiddleware()

router.route('/all').get(middleware.auth(['admin']), controller.getAll)
router.route('/create').post(middleware.auth(['admin']), validator.create, controller.create)
router.route('/update').patch(middleware.auth(['admin']), validator.update, controller.update)
router.route('/:id').get(middleware.auth(['admin']), controller.getOne)

export default router
