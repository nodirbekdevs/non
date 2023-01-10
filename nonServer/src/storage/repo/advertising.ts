import { IAdvertising } from '../../models/Advertising'

export interface AdvertisingRepository {
    find(query: Object): Promise<IAdvertising[]>
    findOne(query: Object): Promise<IAdvertising>
    create(payload: IAdvertising): Promise<IAdvertising>
    update(query: Object, payload: IAdvertising | Object): Promise<IAdvertising>
    updateMany(query: Object, payload: IAdvertising | Object): Promise<Object>
    delete(query: Object): Promise<IAdvertising>
}
