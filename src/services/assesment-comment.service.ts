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

export default {
  findById,
  create,
  update,
  deleteById,
  findByAssessmentId,
};