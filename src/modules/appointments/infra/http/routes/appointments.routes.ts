import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
// Middlewares
import checkAuthenticated from '@modules/users/infra/http/middlewares/checkAuthenticated'
// Controllers
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController'
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController'

const appointmentsRouter = Router()
const appointmentsController = new AppointmentsController()
const providerAppointmentsController = new ProviderAppointmentsController()
appointmentsRouter.use(checkAuthenticated)

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
)
appointmentsRouter.get('/me', providerAppointmentsController.index)

export default appointmentsRouter
