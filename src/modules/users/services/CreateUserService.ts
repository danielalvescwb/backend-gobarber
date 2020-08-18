import { injectable, inject } from 'tsyringe'

import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import IUsersRepository from '@modules/users/repositories/IUserRepository'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import ICacheProvider from '@shared/container/providers/CacheProviders/models/ICacheProvider'

interface IRequest {
  name: string
  email: string
  password: string
}
@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private iHashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email)
    if (checkUserExists) {
      throw new AppError('Email addres alredy used.')
    }
    const hashedPassword = await this.iHashProvider.generateHash(password)
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })
    await this.cacheProvider.invalidatePrefix('providers-list')
    return user
  }
}
export default CreateUserService
