import { SystemRoleEnumType } from '../models/system-role.model';

export type IUser = {
  _id: string;
  userName: string;
  email: string;
  systemRoles: SystemRoleEnumType[];
};