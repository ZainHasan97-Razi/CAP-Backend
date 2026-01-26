import AssesmentCommentModel, { CreateAssesmentCommentDto, UpdateAssesmentCommentDto } from "../models/assesment-comment.model";
import { MongoIdType } from "types/mongoid.type";

const findById = async (id: string | MongoIdType) => {
  return await AssesmentCommentModel.findById(id);
};

const create = async (data: CreateAssesmentCommentDto) => {
  return await AssesmentCommentModel.create(data);
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
  userName: string
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
    attachments: comment.attachments || []
  }));
  
  if (copiedComments.length > 0) {
    return await AssesmentCommentModel.insertMany(copiedComments);
  }
  
  return [];
};

export default {
  findById,
  create,
  update,
  deleteById,
  findByAssessmentId,
  copyCommentsFromAssessment,
};