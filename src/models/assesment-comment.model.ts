import mongoose, { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';
import { ExtractAndFix } from 'types/inferred.schema.type';

export const EvidenceTypeEnum = {
  implementation: "implementation",
  design: "design",
  architectural: "architectural"
} as const
export type EvidenceTypeEnumType = keyof typeof EvidenceTypeEnum;

export const assesmentCommentSchema = new Schema(
  {
    assessmentId: { type: mongoose.Types.ObjectId, required: true, ref: "Assesment" },
    parentCommentId: { type: mongoose.Types.ObjectId, default: null, ref: "AssesmentComment" },
    content: { type: String, required: true, maxlength: 2000 },
    author: { type: String, required: true },
    authorName: { type: String, required: true },
    attachments: { type: [String], default: [] },
    evidenceType: { type: String, enum: EvidenceTypeEnum, default: null },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
  },
  { timestamps: true }
);

export type AssesmentCommentSchemaType = ExtractAndFix<InferSchemaType<typeof assesmentCommentSchema>>;
export type AssesmentCommentDocument = HydratedDocument<AssesmentCommentSchemaType>;
export type CreateAssesmentCommentDto = Omit<AssesmentCommentSchemaType, "createdAt" | "updatedAt" | "isEdited" | "editedAt">;
export type UpdateAssesmentCommentDto = Omit<AssesmentCommentSchemaType, "createdAt" | "updatedAt">;

const AssesmentCommentModel = model('AssesmentComment', assesmentCommentSchema);
export default AssesmentCommentModel;