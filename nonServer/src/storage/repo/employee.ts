import { IEmployee } from '../../models/Employee'

export interface EmployeeRepository {
    find(query: Object): Promise<IEmployee[]>
    findOne(query: object): Promise<IEmployee>
    create(payload: IEmployee): Promise<IEmployee>
    update(query: Object, payload: IEmployee | Object): Promise<IEmployee>
    updateMany(query: Object, payload: IEmployee | Object): Promise<Object>
    delete(query: Object): Promise<IEmployee>
}
