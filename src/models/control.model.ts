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
    domainCode: {type: String, required: true},
    domainName: {type: String, required: true},
    subdomainCode: {type: String, required: false, default: ""},
    subdomainName: {type: String, required: false, default: ""},
    controlCode: {type: String, required: true},
    controlName: {type: String, required: true},
    description: {type: String, default: ""},
    status: { type: String, enum: ControlStatusEnum, default: ControlStatusEnum.active },
  },
  { timestamps: true },
);

controlSchema.index({ frameworkId: 1, controlCode: 1 }, { unique: true });

export type ControlSchemaType = InferSchemaType<typeof controlSchema>;
export type ControlDocument = HydratedDocument<ControlSchemaType>;
export type CreateControlDto = Omit<ControlSchemaType, "createdAt" | "updatedAt" | "status">;
export type UpdateControlDto = Omit<ControlSchemaType, "createdAt" | "updatedAt">;

const ControlModel = model('Control', controlSchema);
export default ControlModel;
