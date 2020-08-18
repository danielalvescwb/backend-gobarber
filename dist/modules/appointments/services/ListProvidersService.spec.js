"use strict";

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProviders/fakes/FakeCacheProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../../users/repositories/fakes/FakeUsersRepository"));

var _ListProvidersService = _interopRequireDefault(require("./ListProvidersService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeCacheProvider;
let fakeUsersRepository;
let listProvidersService;
describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeCacheProvider = new _FakeCacheProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    listProvidersService = new _ListProvidersService.default(fakeUsersRepository, fakeCacheProvider);
  });
  it('Shold be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const user2 = await fakeUsersRepository.create({
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
      password: '123456'
    });
    const loggedUser = await fakeUsersRepository.create({
      name: 'John Doe 3',
      email: 'johndoe3@example.com',
      password: '123456'
    });
    const providers = await listProvidersService.execute({
      user_id: loggedUser.id
    });
    expect(providers).toEqual([user1, user2]);
  });
});