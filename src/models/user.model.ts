import mongoose, { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';
import { SystemRoleEnum } from './system-role.model';

export const UserStatusEnum = {
  pending: "pending",
  active: "active",
  inactive: "inactive"
} as const
export type UserStatusEnumType = keyof typeof UserStatusEnum;

export const userSchema = new Schema(
  {
    userName: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    emailIsVerified: { type: Boolean, default: false },
    status: { type: String, enum: UserStatusEnum, default: UserStatusEnum.active },
    password: { type: String, required: true },
    roleId: { type: mongoose.Types.ObjectId, ref: "Role", default: null },
    role: { type: String, required: false, default: 'guest' },
    departmentId: { type: mongoose.Types.ObjectId, ref: "Department", default: null },
    department: { type: String, default: null },
    systemRoles: {
      type: [String],
      enum: Object.values(SystemRoleEnum),
      default: ['control_owner'],
    },
    sessionId:   { type: String, default: null },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
    passwordHistory: { type: [String], default: [] }, // last 12 hashed passwords
  },
  { timestamps: true },
);

export type UserSchemaType = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserSchemaType>;
export type CreateUserDto = Omit<UserSchemaType, "createdAt" | "updatedAt" | "emailIsVerified" | "status">;

const UserModel = model('User', userSchema);
export default UserModel;
