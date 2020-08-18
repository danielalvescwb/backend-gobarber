import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

// Middlewares
import checkAuthenticated from '@modules/users/infra/http/middlewares/checkAuthenticated'
// Controllers
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController'
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController'
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController'

const providersRouter = Router()
const providersController = new ProvidersController()
const providerDayAvailabilityController = new ProviderDayAvailabilityController()
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController()

providersRouter.use(checkAuthenticated)

providersRouter.get('/', providersController.index)
providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailabilityController.index,
)
providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailabilityController.index,
)
export default providersRouter
