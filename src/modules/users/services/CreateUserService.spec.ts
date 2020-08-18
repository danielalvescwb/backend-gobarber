import FakeCacheProvider from '@shared/container/providers/CacheProviders/fakes/FakeCacheProvider'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import AppError from '@shared/errors/AppError'
import CreateUserService from './CreateUserService'

let fakeCacheProvider: FakeCacheProvider
let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider()
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    )
  })
  it('Shold be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    expect(user).toHaveProperty('id')
  })

  it('Shold be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
