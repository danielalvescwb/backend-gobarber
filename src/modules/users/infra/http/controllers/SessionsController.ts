import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    const createAuthenticateUserService = container.resolve(
      AuthenticateUserService,
    )
    const { user, token } = await createAuthenticateUserService.execute({
      email,
      password,
    })

    return res.json({ user: classToClass(user), token })
  }
}
