import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

export const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
  },
  { timestamps: true }
);

export type RoleSchemaType = InferSchemaType<typeof roleSchema>;
export type RoleDocument = HydratedDocument<RoleSchemaType>;
export type CreateRoleDto = Omit<RoleSchemaType, "createdAt" | "updatedAt">;

const RoleModel = model('Role', roleSchema);
export default RoleModel;
