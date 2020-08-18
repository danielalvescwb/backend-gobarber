import IUsersRepository from '@modules/users/repositories/IUserRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import IFindProvidersDTO from '@modules/users/dtos/IFindProvidersDTO'

import User from '@modules/users/infra/typeorm/entities/User'
import { uuid } from 'uuidv4'

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async findAllProviders({
    exept_user_id,
  }: IFindProvidersDTO): Promise<User[]> {
    let { users } = this
    if (exept_user_id) {
      users = this.users.filter(user => user.id !== exept_user_id)
    }
    return users
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id)
    return findUser
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email)
    return findUser
  }

  public async create(usarData: ICreateUserDTO): Promise<User> {
    const user = new User()
    Object.assign(user, { id: uuid() }, usarData)
    this.users.push(user)
    return user
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id)
    this.users[findIndex] = user
    return user
  }
}
export default FakeUsersRepository
