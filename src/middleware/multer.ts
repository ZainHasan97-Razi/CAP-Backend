import { NextFunction, Response } from 'express';
import multer from 'multer';
import { ARequest } from 'types/auth.request.type';
// import { IRequest } from 'types/user.types';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = (
  req: ARequest,
  res: Response,
  next: NextFunction,
) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'File upload failed' });
    }
    next();
  });
};
