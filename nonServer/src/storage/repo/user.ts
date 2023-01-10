import { IUser } from '../../models/User'

export interface UserRepository {
    find(query: Object): Promise<IUser[]>
    findOne(query: Object): Promise<IUser>
    create(payload: IUser): Promise<IUser>
    update(query: Object, payload: IUser | Object): Promise<IUser>
    delete(query: Object): Promise<IUser>
}
