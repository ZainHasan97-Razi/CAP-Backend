import { Response, NextFunction } from 'express';
import { ARequest } from '../types/auth.request.type';
import { ApiError } from '../middleware/validate.request';
import { SystemRoleEnum } from '../models/system-role.model';
import userActivityService, { ActivityFilters } from '../services/user-activity.service';

// auditor and super_admin can read logs; all operational roles are blocked
const assertCanReadLogs = (req: ARequest) => {
  const roles = req.user?.systemRoles ?? [];
  const allowed = roles.some(r =>
    r === SystemRoleEnum.super_admin || r === SystemRoleEnum.auditor
  );
  if (!allowed) throw ApiError.forbidden('Only auditors and super admins can access audit logs');
};

const extractFilters = (query: any): ActivityFilters => ({
  userId:     query.userId     as string,
  startDate:  query.startDate  as string,
  endDate:    query.endDate    as string,
  page:       query.page       as string,
  action:     query.action     as string,
  method:     query.method     as string,
  statusCode: query.statusCode as string,
});

export const listActivities = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    assertCanReadLogs(req);

    const filters = extractFilters(req.query);
    const pageNum = req.query.pageNum ? parseInt(req.query.pageNum as string, 10) : 1;
    const limit   = req.query.limit   ? parseInt(req.query.limit   as string, 10) : 20;

    const result = await userActivityService.list(filters, pageNum, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
