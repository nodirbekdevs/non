import { IProduct } from '../../models/Product'

export interface ProductRepository {
    find(query: Object): Promise<IProduct[]>
    findOne(query: Object): Promise<IProduct>
    create(payload: IProduct): Promise<IProduct>
    update(query: Object, payload: IProduct | Object): Promise<IProduct>
    updateMany(query: Object, payload: IProduct | Object): Promise<Object>
    delete(query: Object): Promise<IProduct>
}
