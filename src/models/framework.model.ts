import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

export const FrameworkStatusEnum = {
  active: "active",
  inactive: "inactive"
} as const
export type FrameworkStatusEnumType = keyof typeof FrameworkStatusEnum;

export const FrameworkTypeEnum = {
  regulatory_assessment: "regulatory_assessment",
  internal_policy_procedure: "internal_policy_procedure",
  international_standards: "international_standards"
} as const
export type FrameworkTypeEnumType = keyof typeof FrameworkTypeEnum;

export const frameworkSchema = new Schema(
  {
    displayId: {type: String, required: true, unique: true},
    displayName: {type: String, required: true},
    type: { type: String, enum: FrameworkTypeEnum, required: true },
    status: { type: String, enum: FrameworkStatusEnum, default: FrameworkStatusEnum.active },
  },
  { timestamps: true },
);

export type FrameworkSchemaType = InferSchemaType<typeof frameworkSchema>;
export type FrameworkDocument = HydratedDocument<FrameworkSchemaType>;
export type CreateFrameworkDto = Omit<FrameworkSchemaType, "createdAt" | "updatedAt" | "status" | "displayId">;
export type UpdateFrameworkDto = Omit<FrameworkSchemaType, "createdAt" | "updatedAt" | "displayId">;

const FrameworkModel = model('Framework', frameworkSchema);
export default FrameworkModel;
