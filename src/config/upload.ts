import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const imgPath = path.resolve(__dirname, '..', '..', 'img');
export default {
  directory: imgPath,

  storage: multer.diskStorage({
    destination: imgPath,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
      // esse null serve para caso dê erro na inserção. Como não estamos tratando o erro, então
      // não vamos fazer nada
    },
  }),
};
