import { Router } from 'express'
import adminRouter from './admin'
import advertisingRouter from './advertising'
import authRouter from './auth'
import branchRouter from './branch'
import employeeRouter from './employee'
import feedbackRouter from './feedback'
import itemRouter from './item'
import orderRouter from './order'
import productRouter from './product'
import userRouter from './user'
import workRouter from './work'
import analyticsRouter from './analytics'

const router = Router({ mergeParams: true })

router.use('/admin', adminRouter)
router.use('/advertising', advertisingRouter)
router.use('/analytics', analyticsRouter)
router.use('/auth', authRouter)
router.use('/branch', branchRouter)
router.use('/employee', employeeRouter)
router.use('/feedback', feedbackRouter)
router.use('/item', itemRouter)
router.use('/order', orderRouter)
router.use('/product', productRouter)
router.use('/user', userRouter)
router.use('/work', workRouter)

export default router
