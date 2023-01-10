import { IUser } from '../../models/User'
import { UserStorage } from '../../storage/mongo/user'
import Database from '../../core/db'

const storage = new UserStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.user', () => {
    const user = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        telegram_id: 12345678,
        name: 'Name',
        username: 'UserName',
        password: 'password',
        number: '977041815',
        feedback: ['8bf5fc5c-0558-408c-a12-5995dca952a0tr'],
        orders: ['8bf5fc5c-0558-408c-a12-5995dca952a0de'],
        liked_products: ['8bf5fc5c-0558-408c-a12-5995dca952a0d21'],
        total_feedback: 0,
        total_orders: 0,
        total_liked_products: 0,
        num_of_bought: 40,
        lang: 'uz',
        step: 0,
        status: 'completed'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new user: success', () => {
        return storage.create(user as IUser).then((data) => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get all user: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one user: success', () => {
        return storage.findOne({ _id: user._id }).then((data) => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get one user: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update user: success', () => {
        const name = 'Name updated'
        return storage.update(user._id, { name } as IUser).then((data) => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get update user: fail', () => {
        const name = 'Name not updated'
        return storage.update(fake_id, { name } as IUser).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete user: success', () => {
        return storage.delete(user._id).then((data) => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get delete user: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
