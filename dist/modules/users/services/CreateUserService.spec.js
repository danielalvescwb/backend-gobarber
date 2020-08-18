"use strict";

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProviders/fakes/FakeCacheProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _CreateUserService = _interopRequireDefault(require("./CreateUserService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeCacheProvider;
let fakeUsersRepository;
let fakeHashProvider;
let createUser;
describe('CreateUserService', () => {
  beforeEach(() => {
    fakeCacheProvider = new _FakeCacheProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    createUser = new _CreateUserService.default(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
  });
  it('Shold be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    expect(user).toHaveProperty('id');
  });
  it('Shold be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await expect(createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});