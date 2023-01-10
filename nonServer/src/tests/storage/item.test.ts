import { IItem } from '../../models/Item'
import { ItemStorage } from '../../storage/mongo/item'
import Database from '../../core/db'

const storage = new ItemStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.item', () => {
    const item = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        author: 12345678,
        product: 'Non',
        quantity: 50,
        price: 200000,
        step: 0,
        status: 'process'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new item: success', () => {
        return storage.create(item as IItem).then((data) => {
            expect(data._id).toEqual(item._id)
        })
    })

    test('Get all item: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one item: success', () => {
        return storage.findOne({ _id: item._id }).then((data) => {
            expect(data._id).toEqual(item._id)
        })
    })

    test('Get one item: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update item: success', () => {
        const product = 'Patir'
        return storage.update(item._id, { product } as IItem).then((data) => {
            expect(data._id).toEqual(item._id)
        })
    })

    test('Get update item: fail', () => {
        const product = 'Patir'
        return storage.update(fake_id, { product } as IItem).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete item: success', () => {
        return storage.delete(item._id).then((data) => {
            expect(data._id).toEqual(item._id)
        })
    })

    test('Get delete item: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
