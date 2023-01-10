import { IProduct } from '../../models/Product'
import { ProductStorage } from '../../storage/mongo/product'
import Database from '../../core/db'

const storage = new ProductStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.product', () => {
    const product = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        author: 12345678,
        image: 'Name',
        name: 'non',
        description: 'password',
        rating: [1, 2, 3],
        num_of_sold: 60,
        price: 500,
        step: 0,
        status: 'process'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new product: success', () => {
        return storage.create(product as IProduct).then((data) => {
            expect(data._id).toEqual(product._id)
        })
    })

    test('Get all product: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one product: success', () => {
        return storage.findOne({ _id: product._id }).then((data) => {
            expect(data._id).toEqual(product._id)
        })
    })

    test('Get one product: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update product: success', () => {
        const name = 'Patir'
        return storage.update(product._id, { name } as IProduct).then((data) => {
            expect(data._id).toEqual(product._id)
        })
    })

    test('Get update product: fail', () => {
        const name = 'non'
        return storage.update(fake_id, { name } as IProduct).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete product: success', () => {
        return storage.delete(product._id).then((data) => {
            expect(data._id).toEqual(product._id)
        })
    })

    test('Get delete product: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
