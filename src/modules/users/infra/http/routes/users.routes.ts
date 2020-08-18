import { Router } from 'express'
import multer from 'multer'
import { celebrate, Segments, Joi } from 'celebrate'

import uploadConfig from '@config/upload'
import UsersController from '@modules/users/infra/http/controllers/UsersController'
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController'
import checkAuthenticated from '@modules/users/infra/http/middlewares/checkAuthenticated'

const usersRouter = Router()
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()
const uploadImage = multer(uploadConfig.multer)

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
)

usersRouter.patch(
  '/avatar',
  checkAuthenticated,
  uploadImage.single('avatar'),
  userAvatarController.update,
)

export default usersRouter
