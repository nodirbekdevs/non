import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import { message } from '../locales/get_message'
import catchAsync from '../utils/catchAsync'
import moment from 'moment'
import { IOrder } from '../models/Order'

export class AnalyticsController {
    analytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let orders: IOrder[] = []
        const { lang, id } = res.locals

        const allOrders = await storage.order.find({})

        console.log(allOrders)

        for (let i = 0; i < allOrders.length; i++) {
            if (allOrders[i].status !== 'process' && allOrders[i].status !== 'inactive') {
                orders.push(allOrders[i])
            }
        }

        console.log(orders)

        const ordersMap = getOrdersMap(orders)

        console.log(ordersMap)

        const average = calculatePrice(orders)

        const chart = Object.keys(ordersMap).map(label => {
            const gain = calculatePrice(ordersMap[label])
            const order = ordersMap[label].length
            return { label, order, gain }
        })

        res.status(200).json({
            success: true,
            data: {
                chart,
                average
            },
            message: message('admin_getAll_200', lang)
        })
    })
}

const getOrdersMap = (orders: IOrder[]) => {
    const daysOrders: any = {}

    // for (let i = 0; i < orders.length; i++) {
    //     const order = orders[i], date = moment(order.created_at).format('DD.MM.YYYY')
    //
    //     if (date === moment().format("DD.MM.YYYY")) return
    //     if (!daysOrders[date]) daysOrders[date] = []
    //     daysOrders[date].push(date)
    // }

    orders.forEach(order => {
        const date = moment(order.created_at).format('DD.MM.YYYY')

        if (date === moment().format('DD.MM.YYYY')) return

        if (!daysOrders[date]) daysOrders[date] = []

        daysOrders[date].push(order)
    })

    console.log(daysOrders)
    return daysOrders
}

const calculatePrice = (orders: IOrder[]) => {
    let total_sum = 0

    orders.map(order => total_sum += order.price)

    return total_sum
}
