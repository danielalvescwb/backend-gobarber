import { Router, Request, Response, NextFunction } from 'express'

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes'
import providersRouter from '@modules/appointments/infra/http/routes/providers.routes'
import usersRouter from '@modules/users/infra/http/routes/users.routes'
import profileRouter from '@modules/users/infra/http/routes/profile.routes'
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes'
import passwordRouter from '@modules/users/infra/http/routes/password.routes'

const routes = Router()

function logRequests(req: Request, res: Response, next: NextFunction): void {
  const { method, url } = req
  const logLabel = `[${method.toUpperCase()}] URL:${url}`
  // console.log(logLabel)
  console.time(logLabel)
  next()
  console.timeEnd(logLabel)
}
// Para ser usada em todas as requisições
routes.use(logRequests)

routes.use('/appointments', appointmentsRouter)
routes.use('/providers', providersRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/password', passwordRouter)
routes.use('/profile', profileRouter)

export default routes
