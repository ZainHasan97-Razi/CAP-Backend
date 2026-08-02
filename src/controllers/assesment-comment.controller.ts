import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import assesmentCommentService from "../services/assesment-comment.service";
import assesmentService from "../services/assesment.service";
import { ApiError } from "../middleware/validate.request";
import { IUser } from "types/req.user.type";
import { ApprovalStatusEnum } from "../models/assesment-comment.model";
import userActivityService from "../services/user-activity.service";
import axios from "axios";

const getIp = (req: any) =>
  (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
  req.socket?.remoteAddress || 'unknown';

export const getComments = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { assessmentId } = req.params;
    const user = req.user as IUser;

    const comments = await assesmentCommentService.findByAssessmentId(assessmentId);

    // Read-receipt log — evidence view event
    userActivityService.auditLog({
      userId: user._id, userName: user.userName, email: user.email,
      sessionId: user.sessionId, ipAddress: getIp(req),
      eventType: 'EVIDENCE', eventSubtype: 'EVIDENCE_VIEW',
      resourceType: 'EVIDENCE', resourceId: assessmentId,
      action: 'READ', result: 'SUCCESS',
      apiUrl: req.originalUrl, method: req.method,
    }).catch(() => {});

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

    // SoD: only compliance_manager or control_owner can upload evidence (attachments)
    const hasAttachments = req.body.attachments?.length > 0;
    if (hasAttachments) {
      const canUpload = user.systemRoles?.some(r => r === 'compliance_manager' || r === 'control_owner');
      if (!canUpload) {
        userActivityService.auditLog({
          userId: user._id, userName: user.userName, email: user.email,
          sessionId: user.sessionId, ipAddress: getIp(req),
          eventType: 'AUTHORIZATION', eventSubtype: 'ACCESS_DENIED',
          resourceType: 'EVIDENCE', resourceId: assessmentId,
          action: 'CREATE', result: 'DENIED',
          failureReason: 'Role not permitted to upload evidence',
          apiUrl: req.originalUrl, method: req.method,
        }).catch(() => {});
        throw ApiError.forbidden('Only compliance managers and control owners can upload evidence');
      }
    }

    const payload = {
      ...req.body,
      assessmentId,
      author: user.userName,
      authorName: user.userName,
    };

    const comment = await assesmentCommentService.create(payload);

    // Evidence upload audit log
    if (hasAttachments) {
      userActivityService.auditLog({
        userId: user._id, userName: user.userName, email: user.email,
        sessionId: user.sessionId, ipAddress: getIp(req),
        eventType: 'EVIDENCE', eventSubtype: 'EVIDENCE_UPLOAD',
        resourceType: 'EVIDENCE', resourceId: comment._id.toString(),
        action: 'CREATE', result: 'SUCCESS',
        afterValue: { assessmentId, attachments: payload.attachments, evidenceType: payload.evidenceType },
        apiUrl: req.originalUrl, method: req.method,
      }).catch(() => {});
    }

    res.json({ message: 'Comment created successfully', comment });

    // Trigger AI when a top-level comment is posted with attachments
    if (!payload.parentCommentId && payload.attachments?.length > 0) {
      const llmUrl = process.env.LLM_URL;
      if (llmUrl) {
        const assessment = await assesmentService.findById(assessmentId);
        if (assessment) {
          (async () => {
            try {
              await axios.post(`${llmUrl}/evaluate`, {
                assessment_id: assessment._id.toString(),
                evidence_type: comment.evidenceType ?? 'implementation',
                comment: comment.content,
                framework: assessment.frameworkName,
                definition: assessment.controlName,
                attachments: payload.attachments,
              }, {
                headers: {
                  'x-api-key': process.env.LLM_API_KEY || '',
                  'Content-Type': 'application/json',
                },
              });
              console.log('LLM triggered on comment post');
            } catch (err: any) {
              console.error('[AI Trigger] Failed to reach LLM service:', err.message);
            }
          })();
        }
      }
    }
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
      evidenceValidatedAt: undefined, // not allowed on replies
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

    if (!comment.parentCommentId && req.body.evidenceValidatedAt !== undefined) {
      updateData.evidenceValidatedAt = req.body.evidenceValidatedAt;
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

    userActivityService.auditLog({
      userId: user._id, userName: user.userName, email: user.email,
      sessionId: user.sessionId, ipAddress: getIp(req),
      eventType: 'EVIDENCE', eventSubtype: 'EVIDENCE_DELETE',
      resourceType: 'EVIDENCE', resourceId: commentId,
      action: 'DELETE', result: 'SUCCESS',
      beforeValue: { assessmentId: comment.assessmentId, attachments: comment.attachments },
      apiUrl: req.originalUrl, method: req.method,
    }).catch(() => {});

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getCommentVersionHistory = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const versions = await assesmentCommentService.getVersionHistory(commentId);
    res.json({ message: 'Request success', versions });
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

    // Only compliance_manager or assessment_reviewer can approve/reject evidence
    const assessment = await assesmentService.findById(comment.assessmentId.toString());
    if (!assessment) throw ApiError.notFound('Assessment not found');
    const canApprove = user.systemRoles?.some(r => r === 'compliance_manager' || r === 'assessment_reviewer');
    if (!canApprove) {
      throw ApiError.forbidden('Only compliance managers and assessment reviewers can approve evidence');
    }

    // SoD: creator cannot approve their own evidence
    if (assessment.createdBy === user.userName) {
      throw ApiError.forbidden('Assessment creator cannot approve evidence on their own assessment');
    }

    const updated = await assesmentCommentService.setApprovalStatus(commentId, status);

    res.json({ message: `Evidence ${status}`, comment: updated });
  } catch (error) {
    console.error(error);
    next(error);
  }
};