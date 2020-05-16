import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../config/auth';

interface RequestDTO {
  email: string;
  password: string;
}

class AuthenticateUserService {
  public async execute({
    email,
    password,
  }: RequestDTO): Promise<{ user: User; token: string }> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('email ou senha inválidos');
    }

    const passwordMathed = await compare(password, user.password);

    if (!passwordMathed) {
      throw new Error('email ou senha inválidos');
    }

    const { secret, expiresIn } = authConfig.jwt;

    // O sign recebe como parâmetro:
    // o primeiro são os dados criptografados mas não seguros do token. Geralmente colocamos
    // informações que não são sensíveis dentro deste objeto
    // O segundo parâmetro é um secret. A recomendação é que ele seja bem complexo. Para gerar o
    // secret dessa aplicação, fui até o md5 online e digitei uma string aleatória no site e gerei
    // o hash dela. Bem louco né?
    // o terceiro parâmetro são configurações do token
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
