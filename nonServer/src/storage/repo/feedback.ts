import { IFeedback } from '../../models/Feedback'

export interface FeedbackRepository {
    find(query: Object): Promise<IFeedback[]>
    findOne(query: Object): Promise<IFeedback>
    create(payload: IFeedback): Promise<IFeedback>
    update(query: Object, payload: IFeedback | Object): Promise<IFeedback>
    delete(query: Object): Promise<IFeedback>
}
