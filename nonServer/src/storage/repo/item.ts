import { IItem } from '../../models/Item'
import { IEmployee } from '../../models/Employee'

export interface ItemRepository {
    find(query: Object): Promise<IItem[]>
    findOne(query: Object): Promise<IItem>
    create(payload: IItem): Promise<IItem>
    update(query: Object, payload: IItem | Object): Promise<IItem>
    updateMany(query: Object, payload: IItem | Object): Promise<Object>
    delete(query: Object): Promise<IItem>
}
