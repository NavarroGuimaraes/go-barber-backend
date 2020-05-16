import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const tokenAuth = request.headers.authorization;

  if (!tokenAuth) {
    throw new Error('JWT token is missing!');
  }
  // Formato da string do token: Bearer asoknd28u3hrjnnd13r
  // Existe um espaço entre o bearer e o token, para isso, vamos desestruturar
  // o split e já jogar dentro de variáveis
  // esa vírgula indica que a primeira variável do retorno do split deve ser ignorada.
  // Como assim?
  // Seguinte: com essa sintaxe, quando pegarmos o retorno do split, já vamos jogar em mais duas
  // novas variáveis. Fazendo isso, vamos ignorar a primeira, pois é apenas o nome 'bearer'
  // que não precisamos, e no JavaScript existe essa sintaxe de deixar o nome vazio que indica ao
  // JS (no nosso caso TS) que aquela variável ali deve ser ignorada
  const [, token] = tokenAuth.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error('Invalid JWT token!');
  }
}
