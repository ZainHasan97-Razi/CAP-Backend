import mongoose, { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';
import { ExtractAndFix } from 'types/inferred.schema.type';
import { FrameworkTypeEnum, FrameworkTypeEnumType } from './framework.model';

export const AssesmentStatusEnum = {
  drafted: "drafted",
  open: "open",
  in_progress: "in_progress",
  closed: "closed",
} as const
export type AssesmentStatusEnumType = keyof typeof AssesmentStatusEnum;

export const ReviewerApprovalEnum = {
  pending: "pending",
  approved: "approved",
} as const
export type ReviewerApprovalEnumType = keyof typeof ReviewerApprovalEnum;

export const assesmentSchema = new Schema(
  {
    assesmentId: {type: String, required: true}, // uuid so we can group multiple controlIds over an assesmentId (like one assesment)
    name: {type: String, required: true},
    description: {type: String, required: true},
    frameworkType: { type: String, enum: FrameworkTypeEnum, required: true },
    framework: {type: mongoose.Types.ObjectId, required: true, ref: "Framework"},
    frameworkName: {type: String, required: true},
    control: {type: mongoose.Types.ObjectId, default: null, ref: "Control"},
    controlId: {type: String, default: null},
    controlName: {type: String, default: null},
    departments: {type: [{id: mongoose.Types.ObjectId, name: String}], default: []},
    participants: {type: [String], default: []},
    attachments: {type: [String], default: []},
    status: { type: String, enum: AssesmentStatusEnum, default: AssesmentStatusEnum.drafted },
    complianceMetricValue: {type: String, default: null},
    commonAssessmentId: {type: mongoose.Types.ObjectId, default: null, ref: "Assesment"},
    aiResult: {type: mongoose.Schema.Types.Mixed, default: null},
    auditorNotes: {type: String, default: null},
    startDate: {type: Number, required: true}, // unix seconds
    dueDate: {type: Number, required: true}, // unix seconds
    createdBy: {type: String, required: true}, // some auditor person
    reviewerApproval: { type: String, enum: ReviewerApprovalEnum, default: null }, // null = not requested, pending = awaiting reviewer, approved = reviewer signed off
  },
  { timestamps: true },
);

// export type AssesmentSchemaType = InferSchemaType<typeof assesmentSchema>;
export type AssesmentSchemaType = ExtractAndFix<InferSchemaType<typeof assesmentSchema>>;
export type AssesmentDocument = HydratedDocument<AssesmentSchemaType>;
export type CreateAssesmentDto = Omit<AssesmentSchemaType, "createdAt" | "updatedAt" | "status" | "commonAssessmentId" | "complianceMetricValue" | "aiResult" | "auditorNotes" | "reviewerApproval">;
export type UpdateAssesmentDto = Omit<AssesmentSchemaType, "createdAt" | "updatedAt">;

const AssesmentModel = model('Assesment', assesmentSchema);
export default AssesmentModel;
