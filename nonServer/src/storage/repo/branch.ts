import { IBranch } from '../../models/Branch'

export interface BranchRepository {
    find(query: Object): Promise<IBranch[]>
    findOne(query: Object): Promise<IBranch>
    create(payload: IBranch | Object): Promise<IBranch>
    update(query: Object, payload: IBranch | Object): Promise<IBranch>
    delete(query: Object): Promise<IBranch>
}
