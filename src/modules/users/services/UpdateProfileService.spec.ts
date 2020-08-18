import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import UpdateProfileService from './UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfileService: UpdateProfileService

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    )
  })
  it('Shold be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
    })
    expect(updatedUser.name).toBe('John Doe 2')
    expect(updatedUser.email).toBe('johndoe2@example.com')
  })
  it('Shold not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    const user = await fakeUsersRepository.create({
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
      password: '123456',
    })

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('Shold be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
      old_password: '123456',
      password: '123123',
    })
    expect(updatedUser.password).toBe('123123')
  })
  it('Shold not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe 2',
        email: 'johndoe2@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('Shold not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe 2',
        email: 'johndoe2@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('Shold not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-user-id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
