import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

export enum FrameworkStatusEnum {
  active = "active",
  inactive = "inactive"
}
export type FrameworkStatusEnumType = keyof typeof FrameworkStatusEnum;

export const frameworkSchema = new Schema(
  {
    displayName: {type: String, required: true},
    status: { type: String, enum: FrameworkStatusEnum, default: FrameworkStatusEnum.active },
  },
  { timestamps: true },
);

export type FrameworkSchemaType = InferSchemaType<typeof frameworkSchema>;
export type FrameworkDocument = HydratedDocument<FrameworkSchemaType>;
export type CreateFrameworkDto = Omit<FrameworkSchemaType, "createdAt" | "updatedAt" | "status">;
export type UpdateFrameworkDto = Omit<FrameworkSchemaType, "createdAt" | "updatedAt">;

const FrameworkModel = model('Framework', frameworkSchema);
export default FrameworkModel;
