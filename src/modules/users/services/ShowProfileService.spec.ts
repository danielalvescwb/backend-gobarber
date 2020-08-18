import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import AppError from '@shared/errors/AppError'
import ShowProfileService from './ShowProfileService'

let fakeUsersRepository: FakeUsersRepository
let showProfileService: ShowProfileService

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    showProfileService = new ShowProfileService(fakeUsersRepository)
  })
  it('Shold be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    const profile = await showProfileService.execute({
      user_id: user.id,
    })
    expect(profile.name).toBe('John Doe')
    expect(profile.email).toBe('johndoe@example.com')
  })
  it('Shold not be able to show the profile from non-existing user', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
