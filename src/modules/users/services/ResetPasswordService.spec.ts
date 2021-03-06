import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import AppError from '@shared/errors/AppError'
import ResetPasswordService from './ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let resetPasswordService: ResetPasswordService
let fakeHashProvider: FakeHashProvider

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeHashProvider = new FakeHashProvider()
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    )
  })
  it('Shold be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    const { token } = await fakeUserTokensRepository.genarate(user.id)
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')
    await resetPasswordService.execute({
      password: '123123',
      token,
    })
    const updatedUser = await fakeUsersRepository.findById(user.id)
    expect(generateHash).toHaveBeenCalledWith('123123')
    expect(updatedUser?.password).toBe('123123')
  })
  it('Shold not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('Shold not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.genarate(
      'non-existing-user',
    )
    await expect(
      resetPasswordService.execute({
        token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('Shold be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    const userToken = await fakeUserTokensRepository.genarate(user.id)
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()
      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(
      resetPasswordService.execute({
        password: '123123',
        token: userToken.token,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
