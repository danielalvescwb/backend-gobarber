"use strict";

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProviders/fakes/FakeCacheProvider"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _ListProviderAppointmentsService = _interopRequireDefault(require("./ListProviderAppointmentsService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeCacheProvider;
let fakeAppointmentsRepository;
let listProviderAppointmentsService;
describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeCacheProvider = new _FakeCacheProvider.default();
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    listProviderAppointmentsService = new _ListProviderAppointmentsService.default(fakeAppointmentsRepository, fakeCacheProvider);
  });
  it('Shold be able to list the appointments on a especific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 0, 1, 8, 0, 0)
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 0, 1, 9, 0, 0)
    });
    const appointments = await listProviderAppointmentsService.execute({
      provider_id: 'provider',
      year: 2021,
      month: 1,
      day: 1
    });
    expect(appointments).toEqual([appointment1, appointment2]);
  });
});