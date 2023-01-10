import { IOrder } from '../../models/Order'
import { OrderStorage } from '../../storage/mongo/order'
import Database from '../../core/db'

const storage = new OrderStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.order', () => {
    const order = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        admin: 12345678,
        author: 12345698,
        supplier: 12345878,
        items: ['8bf5fc5c-0558-408c-a12f-95dca952a12'],
        total_items: 1,
        price: 300000,
        date: '27.08.2001',
        time: '17:00',
        should_deliver: true,
        location: {
            name: 'place',
            latitude: '89.9999999',
            longitude: '90.9999999'
        },
        signature: 'Image of signature',
        step: 5,
        attempt: 1,
        status: 'process'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new order: success', () => {
        return storage.create(order as IOrder).then((data) => {
            expect(data._id).toEqual(order._id)
        })
    })

    test('Get all order: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one order: success', () => {
        return storage.findOne({ _id: order._id }).then((data) => {
            expect(data._id).toEqual(order._id)
        })
    })

    test('Get one order: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update order: success', () => {
        const date = '28.08.2001'
        return storage.update(order._id, { date } as IOrder).then((data) => {
            expect(data._id).toEqual(order._id)
        })
    })

    test('Get update order: fail', () => {
        const date = '27.08.2001'
        return storage.update(fake_id, { date } as IOrder).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete order: success', () => {
        return storage.delete(order._id).then((data) => {
            expect(data._id).toEqual(item._id)
        })
    })

    test('Get delete order: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
