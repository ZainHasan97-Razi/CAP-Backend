import { NextFunction, Request, Response } from "express";
import { ARequest } from "../types/auth.request.type";
import { IUser } from "../types/req.user.type";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "./validate.request";
import userService from "../services/user.service";
import { SystemRoleEnumType } from "../models/system-role.model";
import userActivityService from "../services/user-activity.service";
import AssesmentModel from "../models/assesment.model";

const getIp = (req: Request) =>
  (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
  req.socket?.remoteAddress || 'unknown';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(ApiError.unauthorized("Not authorized to access this route"));
  }

  try {
    const decoded = verifyToken(token) as IUser;

    if (!decoded) {
      return next(ApiError.unauthorized("Invalid token"));
    }

    const user = await userService.findById(decoded._id);
    if (!user) {
      return next(ApiError.unauthorized("User not found"));
    }

    // Only enforce session check if token has sessionId (new tokens)
    if (decoded.sessionId && user.sessionId !== decoded.sessionId) {
      userActivityService.auditLog({
        userId: decoded._id, userName: decoded.userName, email: decoded.email,
        sessionId: decoded.sessionId, ipAddress: getIp(req),
        eventType: 'AUTHENTICATION', eventSubtype: 'SESSION_INVALID',
        resourceType: 'USER', resourceId: decoded._id,
        action: 'READ', result: 'DENIED',
        failureReason: 'Session expired or logged in from another device',
        apiUrl: req.originalUrl, method: req.method,
      }).catch(() => {});
      return next(ApiError.unauthorized("Session expired, logged in from another device"));
    }

    (req as ARequest).user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return next(ApiError.unauthorized("Not authorized to access this route"));
  }
};

/**
 * Row-level security for control_owner.
 * If the caller's ONLY role is control_owner, they must be a participant on the assessment.
 * Reads assessment ID from req.params.id or req.params.assessmentId.
 * All other roles pass through unchecked.
 */
export const requireAssessmentParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as ARequest).user as IUser;
  const isControlOwnerOnly =
    user?.systemRoles?.length > 0 &&
    user.systemRoles.every(r => r === 'control_owner');

  if (!isControlOwnerOnly) return next();

  const assessmentId = req.params.id || req.params.assessmentId;
  if (!assessmentId) return next();

  const assessment = await AssesmentModel.findById(assessmentId).select('participants').lean();
  if (!assessment) return next(ApiError.notFound('Assessment not found'));

  if (!assessment.participants.includes(user.email)) {
    userActivityService.auditLog({
      userId: user._id, userName: user.userName, email: user.email,
      sessionId: user.sessionId, ipAddress: getIp(req),
      eventType: 'AUTHORIZATION', eventSubtype: 'ACCESS_DENIED',
      resourceType: 'ASSESSMENT', resourceId: assessmentId,
      action: 'READ', result: 'DENIED',
      failureReason: 'Control owner not assigned to this assessment',
      apiUrl: req.originalUrl, method: req.method,
    }).catch(() => {});
    return next(ApiError.forbidden('You are not assigned to this assessment'));
  }

  next();
};

/**
 * Blocks the specified roles from accessing a route.
 * Usage: router.post('/create', blockRoles('super_admin'), handler)
 */
export const blockRoles = (...roles: SystemRoleEnumType[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as ARequest).user as IUser;
    if (user?.systemRoles?.some(r => roles.includes(r as SystemRoleEnumType))) {
      userActivityService.auditLog({
        userId: user._id, userName: user.userName, email: user.email,
        sessionId: user.sessionId, ipAddress: getIp(req),
        eventType: 'AUTHORIZATION', eventSubtype: 'ACCESS_DENIED',
        resourceType: 'USER', resourceId: user._id,
        action: req.method as any, result: 'DENIED',
        failureReason: `Role(s) [${user.systemRoles.filter(r => roles.includes(r as SystemRoleEnumType)).join(', ')}] blocked from this route`,
        apiUrl: req.originalUrl, method: req.method,
      }).catch(() => {});
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
