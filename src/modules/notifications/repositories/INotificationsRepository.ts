import Notifications from '@modules/notifications/infra/typeorm/schemas/Notifications'
import ICreateNotificationsDTO from '@modules/notifications/dtos/ICreateNotificationsDTO'

export default interface INotificationsRepository {
  create(data: ICreateNotificationsDTO): Promise<Notifications>
}
