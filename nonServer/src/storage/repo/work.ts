import { IWork } from '../../models/Work'

export interface WorkRepository {
    find(query: Object): Promise<IWork[]>
    findOne(query: Object): Promise<IWork>
    create(payload: IWork): Promise<IWork>
    update(query: Object, payload: IWork | Object): Promise<IWork>
    delete(query: Object): Promise<IWork>
}
