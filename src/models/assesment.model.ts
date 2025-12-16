import mongoose, { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

export enum AssesmentStatusEnum {
  open = "open",
  in_progress = "in_progress",
  closed = "closed",
  discard = "discard",
}
export type AssesmentStatusEnumType = keyof typeof AssesmentStatusEnum;

export enum PriorityStatusEnum {
  high = "high",
  medium = "medium",
  low = "low",
}
export type PriorityStatusEnumType = keyof typeof PriorityStatusEnum;

export const assesmentSchema = new Schema(
  {
    assesmentId: {type: String, required: true}, // uuid so we can group multiple controlIds over an assesmentId (like one assesment)
    name: {type: String, required: true},
    description: {type: String, required: true},
    framework: {type: mongoose.Types.ObjectId, required: true, ref: "Framework"},
    frameworkName: {type: String, required: true},
    control: {type: mongoose.Types.ObjectId, required: true, ref: "Control"},
    controlId: {type: String, required: true},
    controlName: {type: String, required: true},
    participants: {type: [String], default: []},
    attachments: {type: [String], default: []},
    status: { type: String, enum: AssesmentStatusEnum, default: AssesmentStatusEnum.open },
    priority: { type: String, enum: PriorityStatusEnum },
    dueDate: {type: Number, required: true}, // unix
    createdBy: {type: String, required: true}, // some auditor person
  },
  { timestamps: true },
);

export type AssesmentSchemaType = InferSchemaType<typeof assesmentSchema>;
export type AssesmentDocument = HydratedDocument<AssesmentSchemaType>;
export type CreateAssesmentDto = Omit<AssesmentSchemaType, "createdAt" | "updatedAt" | "status">;
export type UpdateAssesmentDto = Omit<AssesmentSchemaType, "createdAt" | "updatedAt">;

const AssesmentModel = model('Assesment', assesmentSchema);
export default AssesmentModel;
