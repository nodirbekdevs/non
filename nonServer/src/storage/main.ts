import { AdminStorage } from './mongo/admin'
import { AdvertisingStorage } from './mongo/advertising'
import { BranchStorage } from './mongo/branch'
import { EmployeeStorage } from './mongo/employee'
import { FeedbackStorage } from './mongo/feedback'
import { ItemStorage } from './mongo/item'
import { OrderStorage } from './mongo/order'
import { ProductStorage } from './mongo/product'
import { UserStorage } from './mongo/user'
import { WorkStorage } from './mongo/work'

interface IStorage {
    admin: AdminStorage
    advertising: AdvertisingStorage
    branch: BranchStorage
    employee: EmployeeStorage
    feedback: FeedbackStorage
    item: ItemStorage
    order: OrderStorage
    product: ProductStorage
    user: UserStorage,
    work: WorkStorage
}

export let storage: IStorage = {
    admin: new AdminStorage(),
    advertising: new AdvertisingStorage(),
    branch: new BranchStorage(),
    employee: new EmployeeStorage(),
    feedback: new FeedbackStorage(),
    item: new ItemStorage(),
    order: new OrderStorage(),
    product: new ProductStorage(),
    user: new UserStorage(),
    work: new WorkStorage()
}
