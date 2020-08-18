import { getRepository, Repository, Not } from 'typeorm'

import IUsersRepository from '@modules/users/repositories/IUserRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import IFindProvidersDTO from '@modules/users/dtos/IFindProvidersDTO'

import User from '@modules/users/infra/typeorm/entities/User'

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>

  constructor() {
    this.ormRepository = getRepository(User)
  }

  public async findAllProviders({
    exept_user_id,
  }: IFindProvidersDTO): Promise<User[]> {
    let users: User[]
    if (exept_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(exept_user_id),
        },
      })
    } else {
      users = await this.ormRepository.find()
    }
    return users
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id)
    return user
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    })
    return user
  }

  public async create(usarData: ICreateUserDTO): Promise<User> {
    const appointment = this.ormRepository.create(usarData)
    await this.ormRepository.save(appointment)
    return appointment
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user)
  }
}
export default UsersRepository
