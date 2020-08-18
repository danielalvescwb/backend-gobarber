import { ObjectID } from 'mongodb'

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICreateNotificationsDTO from '@modules/notifications/dtos/ICreateNotificationsDTO'

import Notifications from '@modules/notifications/infra/typeorm/schemas/Notifications'

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notifications[] = []

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationsDTO): Promise<Notifications> {
    const notification = new Notifications()
    Object.assign(notification, { id: new ObjectID(), content, recipient_id })
    this.notifications.push(notification)
    return notification
  }
}
export default FakeNotificationsRepository
