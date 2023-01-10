import { IEmployee } from '../../models/Employee'
import { EmployeeStorage } from '../../storage/mongo/employee'
import Database from '../../core/db'

const storage = new EmployeeStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.employee', () => {
    const employee = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        telegram_id: 12345678,
        admin: 12345698,
        name: 'Name',
        username: 'UserName',
        password: 'password',
        number: '977041815',
        orders: ['8bf5fc5c-0558-408c-a12-5995dca952a0de'],
        feedback: ['8bf5fc5c-0558-408c-a12-5995dca952a0tr'],
        total_orders: 0,
        total_feedback: 0,
        num_of_delivered_product: 40,
        is_idler: false,
        step: 0,
        status: 'completed'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new employee: success', () => {
        return storage.create(employee as IEmployee).then((data) => {
            expect(data._id).toEqual(employee._id)
        })
    })

    test('Get all employee: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one employee: success', () => {
        return storage.findOne({ _id: employee._id }).then((data) => {
            expect(data._id).toEqual(employee._id)
        })
    })

    test('Get one employee: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update employee: success', () => {
        const name = 'Name updated'
        return storage.update(employee._id, { name } as IEmployee).then((data) => {
            expect(data._id).toEqual(employee._id)
        })
    })

    test('Get update employee: fail', () => {
        const name = 'Name not updated'
        return storage.update(fake_id, { name } as IEmployee).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete employee: success', () => {
        return storage.delete(employee._id).then((data) => {
            expect(data._id).toEqual(employee._id)
        })
    })

    test('Get delete employee: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
