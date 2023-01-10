import { IAdmin } from '../../models/Admin'

export interface AdminRepository {
    find(query: Object): Promise<IAdmin[]>
    findOne(query: Object): Promise<IAdmin>
    create(payload: IAdmin): Promise<IAdmin>
    update(query: Object, payload: IAdmin | Object): Promise<IAdmin>
    delete(query: Object): Promise<IAdmin>
}
