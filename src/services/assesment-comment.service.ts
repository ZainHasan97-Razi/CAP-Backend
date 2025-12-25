import AssesmentCommentModel, { CreateAssesmentCommentDto, UpdateAssesmentCommentDto } from "../models/assesment-comment.model";
import { MongoIdType } from "types/mongoid.type";

const create = async (payload: CreateAssesmentCommentDto) => {
  return await AssesmentCommentModel.create(payload);
};

const findByAssessmentId = async (assessmentId: string | MongoIdType) => {
  const comments = await AssesmentCommentModel.find({ assessmentId })
    .sort({ createdAt: 1 })
    .lean();
  
  const commentMap = new Map();
  const topLevelComments: any[] = [];
  
  comments.forEach(comment => {
    comment.replies = [];
    commentMap.set(comment._id.toString(), comment);
    
    if (!comment.parentCommentId) {
      topLevelComments.push(comment);
    }
  });
  
  comments.forEach(comment => {
    if (comment.parentCommentId) {
      const parent = commentMap.get(comment.parentCommentId.toString());
      if (parent) {
        parent.replies.push(comment);
      }
    }
  });
  
  return topLevelComments;
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

const findById = async (id: string | MongoIdType) => {
  return await AssesmentCommentModel.findById(id);
};

export default {
  create,
  findByAssessmentId,
  update,
  deleteById,
  findById,
};