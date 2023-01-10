import { IAdvertising } from '../../models/Advertising'
import { AdvertisingStorage } from '../../storage/mongo/advertising'
import Database from '../../core/db'

const storage = new AdvertisingStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.advertising', () => {
    const advertising = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        author: 12345678,
        image: 'Name',
        title: 'UserName',
        description: 'password',
        step: 0,
        status: 'process'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new advertising: success', () => {
        return storage.create(advertising as IAdvertising).then((data) => {
            expect(data._id).toEqual(advertising._id)
        })
    })

    test('Get all advertising: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one advertising: success', () => {
        return storage.findOne({ _id: advertising._id }).then((data) => {
            expect(data._id).toEqual(advertising._id)
        })
    })

    test('Get one advertising: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update advertising: success', () => {
        const title = 'Name updated'
        return storage.update(advertising._id, { title } as IAdvertising).then((data) => {
            expect(data._id).toEqual(advertising._id)
        })
    })

    test('Get update advertising: fail', () => {
        const title = 'Name not updated'
        return storage.update(fake_id, { title } as IAdvertising).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete advertising: success', () => {
        return storage.delete(advertising._id).then((data) => {
            expect(data._id).toEqual(advertising._id)
        })
    })

    test('Get delete advertising: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
