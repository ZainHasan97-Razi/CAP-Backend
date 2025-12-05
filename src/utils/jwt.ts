import { UserDocument } from "../models/user.model";
import { IUser } from "types/req.user.type";

let jwt = require('jsonwebtoken');
// key will come from env

export const issueJwt = (user: UserDocument) => {
  const expiresIn = '10d';

  const payload: IUser = {
    _id: user._id.toString(),
    email: user.email,
    userName: user.userName,
  }

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });

  return {
    token: signedToken,
    expires: expiresIn,
  };
};

export const verifyToken = (token: string): IUser => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
