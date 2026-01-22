import mongoose, { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

export const ControlStatusEnum = {
  active: "active",
  inactive: "inactive"
} as const
export type ControlStatusEnumType = keyof typeof ControlStatusEnum;

export const controlSchema = new Schema(
  {
    frameworkId: {type: mongoose.Types.ObjectId, required: true, ref: "Framework"},
    frameworkName: {type: String, required: true},
    controlId: {type: String, required: true},
    displayName: {type: String, required: true},
    groupId: {type: String, required: true},
    groupName: {type: String, required: true},
    description: {type: String, default: ""},
    status: { type: String, enum: ControlStatusEnum, default: ControlStatusEnum.active },
  },
  { timestamps: true },
);

export type ControlSchemaType = InferSchemaType<typeof controlSchema>;
export type ControlDocument = HydratedDocument<ControlSchemaType>;
export type CreateControlDto = Omit<ControlSchemaType, "createdAt" | "updatedAt" | "status">;
export type UpdateControlDto = Omit<ControlSchemaType, "createdAt" | "updatedAt">;

const ControlModel = model('Control', controlSchema);
export default ControlModel;
