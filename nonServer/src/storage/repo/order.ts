import { IOrder } from '../../models/Order'

export interface OrderRepository {
    find(query: Object): Promise<IOrder[]>
    findOne(query: Object): Promise<IOrder>
    create(payload: IOrder): Promise<IOrder>
    update(query: Object, payload: IOrder | Object): Promise<IOrder>
    delete(query: Object): Promise<IOrder>
}
