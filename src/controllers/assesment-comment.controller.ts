import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import assesmentCommentService from "../services/assesment-comment.service";
import { ApiError } from "../middleware/validate.request";
import { IUser } from "types/req.user.type";

export const getComments = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { assessmentId } = req.params;
    const comments = await assesmentCommentService.findByAssessmentId(assessmentId);
    res.json({ message: 'Request success', comments });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createComment = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { assessmentId } = req.params;
    const user = req.user as IUser;
    
    const payload = {
      ...req.body,
      assessmentId,
      author: user.userName,
      authorName: user.userName,
    };
    
    const comment = await assesmentCommentService.create(payload);
    res.json({ message: 'Comment created successfully', comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createReply = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { assessmentId, commentId } = req.params;
    const user = req.user as IUser;
    
    // Get parent comment to inherit evidenceType
    const parentComment = await assesmentCommentService.findById(commentId);
    if (!parentComment) {
      throw ApiError.badRequest("Parent comment not found");
    }
    
    const payload = {
      ...req.body,
      assessmentId,
      parentCommentId: commentId,
      author: user.userName,
      authorName: user.userName,
      evidenceType: parentComment.evidenceType, // Inherit from parent
    };
    
    const reply = await assesmentCommentService.create(payload);
    res.json({ message: 'Reply created successfully', reply });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateComment = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    
    const comment = await assesmentCommentService.findById(commentId);
    if (!comment) {
      throw ApiError.badRequest("Comment not found");
    }
    
    const user = req.user as IUser;
    if (comment.author !== user.userName) {
      throw ApiError.forbidden("You can only edit your own comments");
    }
    
    // Only allow evidenceType update for top-level comments
    const updateData: any = {
      content: req.body.content,
      attachments: req.body.attachments
    };
    
    if (!comment.parentCommentId && req.body.evidenceType !== undefined) {
      updateData.evidenceType = req.body.evidenceType;
    }
    
    const updatedComment = await assesmentCommentService.update(commentId, updateData);
    res.json({ message: 'Comment updated successfully', comment: updatedComment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteComment = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    
    const comment = await assesmentCommentService.findById(commentId);
    if (!comment) {
      throw ApiError.badRequest("Comment not found");
    }
    
    const user = req.user as IUser;
    if (comment.author !== user.userName) {
      throw ApiError.forbidden("You can only delete your own comments");
    }
    
    await assesmentCommentService.deleteById(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};