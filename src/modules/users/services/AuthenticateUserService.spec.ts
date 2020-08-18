import FakeCacheProvider from '@shared/container/providers/CacheProviders/fakes/FakeCacheProvider'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import AppError from '@shared/errors/AppError'
import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

let fakeCacheProvider: FakeCacheProvider
let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService
let createAuthenticateUserService: AuthenticateUserService

describe('CreateSessionService', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider()
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    )
    createAuthenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )
  })
  it('Shold be able to create a new session', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const session = await createAuthenticateUserService.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })
    expect(session).toHaveProperty('token')
    expect(session.user).toEqual(user)
  })

  it('Shold be able to create a new session with non existing user', async () => {
    await expect(
      createAuthenticateUserService.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Shold not be able to session with wrong password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(
      createAuthenticateUserService.execute({
        email: 'johndoe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
