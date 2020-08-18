import UserToken from '../infra/typeorm/entities/UserToken'

export default interface IUserTokensRepository {
  genarate(user_id: string): Promise<UserToken>
  findByToken(token: string): Promise<UserToken | undefined>
}
