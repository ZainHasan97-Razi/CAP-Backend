import { Request } from 'express';
import { IUser } from './req.user.type';

export interface ARequest extends Request {
  user?: IUser;
}

// export type AResponse = Request & {
//   user: any;
// } as const;