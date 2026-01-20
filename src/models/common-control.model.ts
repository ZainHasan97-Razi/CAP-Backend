import mongoose, { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

export const CommonControlStatusEnum = {
  active: "active",
  inactive: "inactive"
} as const
export type CommonControlStatusEnumType = keyof typeof CommonControlStatusEnum;

export const commonControlSchema = new Schema(
  {
    displayName: {type: String, required: true},
    description: {type: String, required: true},
    mappedControls: [{
      frameworkId: {type: mongoose.Types.ObjectId, required: true, ref: "Framework"},
      frameworkName: {type: String, required: true},
      controlId: {type: mongoose.Types.ObjectId, required: true, ref: "Control"},
      controlCode: {type: String, required: true}, // e.g., "AC-1", "SAMA-CSF-1.1"
      controlName: {type: String, required: true}
    }],
    status: { type: String, enum: CommonControlStatusEnum, default: CommonControlStatusEnum.active },
  },
  { timestamps: true },
);

export type CommonControlSchemaType = InferSchemaType<typeof commonControlSchema>;
export type CommonControlDocument = HydratedDocument<CommonControlSchemaType>;
export type CreateCommonControlDto = Omit<CommonControlSchemaType, "createdAt" | "updatedAt" | "status">;
export type UpdateCommonControlDto = Omit<CommonControlSchemaType, "createdAt" | "updatedAt">;

const CommonControlModel = model('CommonControl', commonControlSchema);
export default CommonControlModel;