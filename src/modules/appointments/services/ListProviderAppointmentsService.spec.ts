import FakeCacheProvider from '@shared/container/providers/CacheProviders/fakes/FakeCacheProvider'
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'
import ListProviderAppointmentsService from './ListProviderAppointmentsService'

let fakeCacheProvider: FakeCacheProvider
let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderAppointmentsService: ListProviderAppointmentsService

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider()
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    )
  })
  it('Shold be able to list the appointments on a especific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 0, 1, 8, 0, 0),
    })
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 0, 1, 9, 0, 0),
    })
    const appointments = await listProviderAppointmentsService.execute({
      provider_id: 'provider',
      year: 2021,
      month: 1,
      day: 1,
    })
    expect(appointments).toEqual([appointment1, appointment2])
  })
})
