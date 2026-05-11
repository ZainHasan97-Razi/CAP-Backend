import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import assesmentCommentService from "../services/assesment-comment.service";
import assesmentService from "../services/assesment.service";
import { ApiError } from "../middleware/validate.request";
import { IUser } from "types/req.user.type";
import { ApprovalStatusEnum } from "../models/assesment-comment.model";

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

export const updateApproval = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const { status } = req.body as { status: keyof typeof ApprovalStatusEnum };
    const user = req.user as IUser;

    const comment = await assesmentCommentService.findById(commentId);
    if (!comment) throw ApiError.notFound('Comment not found');
    if (comment.parentCommentId) throw ApiError.badRequest('Cannot approve a reply');
    if (!comment.attachments || comment.attachments.length === 0) {
      throw ApiError.badRequest('Only comments with attachments can be approved');
    }

    // Only the assessment creator (auditor) can approve/reject
    const assessment = await assesmentService.findById(comment.assessmentId.toString());
    if (!assessment) throw ApiError.notFound('Assessment not found');
    if (assessment.createdBy !== user.userName) {
      throw ApiError.forbidden('Only the assessment owner can approve evidence');
    }

    const updated = await assesmentCommentService.setApprovalStatus(commentId, status);

    // Trigger AI on approval
    if (status === ApprovalStatusEnum.approved) {
      const approvedAttachments = await assesmentCommentService.findApprovedAttachmentsByAssessment(
        comment.assessmentId.toString()
      );

      const llmUrl = process.env.LLM_URL;
      if (llmUrl) {
        (async () => {
          try {
            const formData = new FormData();
            formData.append('assessment_id', assessment._id.toString());
            formData.append('evidence_type', comment.evidenceType || '');
            formData.append('comment', comment.content);
            formData.append('framework', assessment.frameworkName);
            formData.append('definition', assessment.controlName);

            // Fetch each file from GCP and append as binary
            await Promise.all(
              approvedAttachments.map(async (url) => {
                const fileRes = await fetch(url);
                const buffer = await fileRes.arrayBuffer();
                const fileName = url.split('/').pop() || 'file';
                const contentType = fileRes.headers.get('content-type') || 'application/octet-stream';
                formData.append('attachments', new Blob([buffer], { type: contentType }), fileName);
              })
            );

            await fetch(`${llmUrl}/evaluate`, {
              method: 'POST',
              headers: { 'x-api-key': process.env.LLM_API_KEY || '' },
              body: formData,
            });
          } catch (err) {
            console.error('[AI Trigger] Failed to reach LLM service:', err);
          }
        })();
      }
    }

    res.json({ message: `Evidence ${status}`, comment: updated });
  } catch (error) {
    console.error(error);
    next(error);
  }
};