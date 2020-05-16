declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
// Esse arquivo adiciona uma nova propriedade ao tipo request da biblioteca express
