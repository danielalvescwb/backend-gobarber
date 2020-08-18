import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import ForgotPasswordController from '@modules/users/infra/http/controllers/ForgotPasswordController'
import ResetPasswordController from '@modules/users/infra/http/controllers/ResetPasswordController'

const passwordRoutes = Router()
const forgotPasswordController = new ForgotPasswordController()
const resetPasswordController = new ResetPasswordController()

passwordRoutes.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
)
passwordRoutes.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.create,
)

export default passwordRoutes
