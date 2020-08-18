"use strict";

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProviders/fakes/FakeCacheProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _AuthenticateUserService = _interopRequireDefault(require("./AuthenticateUserService"));

var _CreateUserService = _interopRequireDefault(require("./CreateUserService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeCacheProvider;
let fakeUsersRepository;
let fakeHashProvider;
let createUser;
let createAuthenticateUserService;
describe('CreateSessionService', () => {
  beforeEach(() => {
    fakeCacheProvider = new _FakeCacheProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    createUser = new _CreateUserService.default(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    createAuthenticateUserService = new _AuthenticateUserService.default(fakeUsersRepository, fakeHashProvider);
  });
  it('Shold be able to create a new session', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const session = await createAuthenticateUserService.execute({
      email: 'johndoe@example.com',
      password: '123456'
    });
    expect(session).toHaveProperty('token');
    expect(session.user).toEqual(user);
  });
  it('Shold be able to create a new session with non existing user', async () => {
    await expect(createAuthenticateUserService.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('Shold not be able to session with wrong password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await expect(createAuthenticateUserService.execute({
      email: 'johndoe@example.com',
      password: 'wrong-password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});