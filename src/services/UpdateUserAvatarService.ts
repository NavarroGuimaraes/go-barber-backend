import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';

interface RequestDTO {
  user_id: string;
  avatar_filename: string;
}

export default class UpdateUserAvatarService {
  public async execute({
    user_id,
    avatar_filename,
  }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { id: user_id } });

    if (!user) {
      throw new Error('logged user is not valid!');
    }

    if (user.avatar) {
      // se o usuário já tiver um avatar, vamos removê-lo
      const currentUserAvatarPath = path.join(
        uploadConfig.directory,
        user.avatar,
      );
      const imageExists = await fs.promises.stat(currentUserAvatarPath);

      if (imageExists) {
        await fs.promises.unlink(currentUserAvatarPath);
      }
    }

    user.avatar = avatar_filename;

    await userRepository.save(user);

    return user;
  }
}
