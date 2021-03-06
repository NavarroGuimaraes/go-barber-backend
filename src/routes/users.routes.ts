import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthentication from '../middlewares/ensureAuthentication';
import uploadConfig from '../config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const createUserService = new CreateUserService();
  const user = await createUserService.execute({
    name,
    email,
    password,
  });
  delete user.password;
  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatar_filename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
