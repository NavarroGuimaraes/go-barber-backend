import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const usersRepository = getRepository(User);

    const existsUser = await usersRepository.findOne({
      where: { email },
    });

    if (existsUser) {
      throw new AppError('This email is already used', 403);
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      email,
      name,
      password: hashedPassword,
    });
    await usersRepository.save(user);
    return user;
  }
}

export default CreateUserService;
