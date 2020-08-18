import { getMongoRepository, MongoRepository } from 'typeorm'

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICreateNotificationsDTO from '@modules/notifications/dtos/ICreateNotificationsDTO'

import Notifications from '@modules/notifications/infra/typeorm/schemas/Notifications'

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notifications>

  constructor() {
    this.ormRepository = getMongoRepository(Notifications, 'mongo_connection')
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationsDTO): Promise<Notifications> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    })
    await this.ormRepository.save(notification)
    return notification
  }
}
export default NotificationsRepository
