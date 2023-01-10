import { IAdmin } from '../../models/Admin'
import { AdminStorage } from '../../storage/mongo/admin'
import Database from '../../core/db'

const storage = new AdminStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.admin', () => {
    const admin = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        telegram_id: 12345678,
        name: 'Name',
        username: 'UserName',
        password: 'password',
        number: '977041815',
        advertisements: ['8bf5fc5c-0558-408c-a12-5995dca952a0de'],
        products: ['8bf5fc5c-0558-408c-a12-5995dca952a0tr'],
        total_advertisements: 0,
        total_products: 0,
        step: 0,
        type: 'super_admin',
        status: 'active'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new admin: success', () => {
        return storage.create(admin as IAdmin).then((data) => {
            expect(data._id).toEqual(admin._id)
        })
    })

    test('Get all admin: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one admin: success', () => {
        return storage.findOne({ _id: admin._id }).then((data) => {
            expect(data._id).toEqual(admin._id)
        })
    })

    test('Get one admin: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update admin: success', () => {
        const name = 'Name updated'
        return storage.update(admin._id, { name } as IAdmin).then((data) => {
            expect(data._id).toEqual(admin._id)
        })
    })

    test('Get update admin: fail', () => {
        const name = 'Name not updated'
        return storage.update(fake_id, { name } as IAdmin).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete admin: success', () => {
        return storage.delete(admin._id).then((data) => {
            expect(data._id).toEqual(admin._id)
        })
    })

    test('Get delete admin: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
