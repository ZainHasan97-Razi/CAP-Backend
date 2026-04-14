import AssesmentCommentModel, { ApprovalStatusEnum, CreateAssesmentCommentDto, UpdateAssesmentCommentDto } from "../models/assesment-comment.model";
import AssesmentModel from "../models/assesment.model";
import { MongoIdType } from "types/mongoid.type";

const findById = async (id: string | MongoIdType) => {
  return await AssesmentCommentModel.findById(id);
};

const create = async (data: CreateAssesmentCommentDto) => {
  const isTopLevelWithAttachments = !data.parentCommentId && data.attachments && data.attachments.length > 0;

  const comment = await AssesmentCommentModel.create({
    ...data,
    approvalStatus: isTopLevelWithAttachments ? ApprovalStatusEnum.pending : null,
  });
  
  if ((data.attachments && data.attachments.length > 0) || data.evidenceType) {
    const assessment = await AssesmentModel.findById(data.assessmentId);
    if (assessment && assessment.status === "open") {
      await AssesmentModel.findByIdAndUpdate(data.assessmentId, { status: "in_progress" });
    }
  }
  
  return comment;
};

const update = async (id: string | MongoIdType, data: UpdateAssesmentCommentDto) => {
  return await AssesmentCommentModel.findByIdAndUpdate(
    id, 
    { ...data, isEdited: true, editedAt: new Date() }, 
    { new: true }
  );
};

const deleteById = async (id: string | MongoIdType) => {
  return await AssesmentCommentModel.findByIdAndDelete(id);
};

const findByAssessmentId = async (assessmentId: string | MongoIdType) => {
  const comments = await AssesmentCommentModel.find({ assessmentId })
    .sort({ createdAt: 1 })
    .lean();
  
  const commentMap = new Map();
  const topLevelComments: any[] = [];
  
  comments.forEach((comment: any) => {
    comment.replies = [];
    commentMap.set(comment._id.toString(), comment);
    
    if (!comment.parentCommentId) {
      topLevelComments.push(comment);
    }
  });
  
  comments.forEach((comment: any) => {
    if (comment.parentCommentId) {
      const parent = commentMap.get(comment.parentCommentId.toString());
      if (parent) {
        parent.replies.push(comment);
      }
    }
  });
  
  return topLevelComments;
};

const copyCommentsFromAssessment = async (
  sourceAssessmentId: string | MongoIdType,
  targetAssessmentId: string | MongoIdType,
  userId: string,
  userName: string,
  importedFromId?: MongoIdType
) => {
  const sourceComments = await AssesmentCommentModel.find({ 
    assessmentId: sourceAssessmentId,
    parentCommentId: null
  }).lean();
  
  const copiedComments = sourceComments.map(comment => ({
    assessmentId: targetAssessmentId,
    parentCommentId: null,
    content: comment.content,
    author: userId,
    authorName: userName,
    attachments: comment.attachments || [],
    evidenceType: comment.evidenceType,
    importedFrom: importedFromId || null
  }));
  
  if (copiedComments.length > 0) {
    return await AssesmentCommentModel.insertMany(copiedComments);
  }
  
  return [];
};

const deleteImportedComments = async (
  assessmentId: string | MongoIdType,
  importedFromId: MongoIdType
) => {
  return await AssesmentCommentModel.deleteMany({
    assessmentId,
    importedFrom: importedFromId
  });
};

const setApprovalStatus = async (
  commentId: string | MongoIdType,
  status: keyof typeof ApprovalStatusEnum
) => {
  return await AssesmentCommentModel.findByIdAndUpdate(
    commentId,
    { approvalStatus: status },
    { new: true }
  );
};

const findApprovedAttachmentsByAssessment = async (assessmentId: string | MongoIdType): Promise<string[]> => {
  const approvedComments = await AssesmentCommentModel.find({
    assessmentId,
    parentCommentId: null,
    approvalStatus: ApprovalStatusEnum.approved,
    attachments: { $exists: true, $not: { $size: 0 } },
  }).select('attachments').lean();

  return approvedComments.flatMap(c => c.attachments);
};

export default {
  findById,
  create,
  update,
  deleteById,
  findByAssessmentId,
  copyCommentsFromAssessment,
  deleteImportedComments,
  setApprovalStatus,
  findApprovedAttachmentsByAssessment,
};