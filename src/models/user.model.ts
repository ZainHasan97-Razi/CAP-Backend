import mongoose, { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

export const UserStatusEnum = {
  pending: "pending",
  active: "active",
  inactive: "inactive"
} as const
export type UserStatusEnumType = keyof typeof UserStatusEnum;

export const UserRoleEnum = {
  executive: "executive",
  auditor: "auditor",
  team_lead: "team_lead",
  team_member: "team_member"
} as const
export type UserRoleEnumType = keyof typeof UserRoleEnum;

export const userSchema = new Schema(
  {
    userName: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    emailIsVerified: { type: Boolean, default: false },
    status: { type: String, enum: UserStatusEnum, default: UserStatusEnum.active },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: UserRoleEnum },
    departmentId: { type: mongoose.Types.ObjectId, ref: "Department", default: null },
    department: { type: String, default: null },
  },
  { timestamps: true },
);

export type UserSchemaType = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserSchemaType>;
export type CreateUserDto = Omit<UserSchemaType, "createdAt" | "updatedAt" | "emailIsVerified" | "status">;

const UserModel = model('User', userSchema);
export default UserModel;
