import mongoose, { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

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
    roleId: { type: mongoose.Types.ObjectId, ref: "Role", required: true },
    role: { type: String, required: true },
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
