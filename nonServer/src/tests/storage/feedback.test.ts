import { IFeedback } from '../../models/Feedback'
import { FeedbackStorage } from '../../storage/mongo/feedback'
import Database from '../../core/db'

const storage = new FeedbackStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.feedback', () => {
    const feedback = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        author: 12345678,
        is_employee: false,
        title: 'UserName',
        description: 'password',
        step: 0,
        status: 'process'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new feedback: success', () => {
        return storage.create(feedback as IFeedback).then((data) => {
            expect(data._id).toEqual(feedback._id)
        })
    })

    test('Get all feedback: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one feedback: success', () => {
        return storage.findOne({ _id: feedback._id }).then((data) => {
            expect(data._id).toEqual(feedback._id)
        })
    })

    test('Get one feedback: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update feedback: success', () => {
        const title = 'Name updated'
        return storage.update(feedback._id, { title } as IFeedback).then((data) => {
            expect(data._id).toEqual(feedback._id)
        })
    })

    test('Get update feedback: fail', () => {
        const title = 'Name not updated'
        return storage.update(fake_id, { title } as IFeedback).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete feedback: success', () => {
        return storage.delete(feedback._id).then((data) => {
            expect(data._id).toEqual(feedback._id)
        })
    })

    test('Get delete feedback: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
