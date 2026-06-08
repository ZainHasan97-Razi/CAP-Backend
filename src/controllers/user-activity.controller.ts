import { Response, NextFunction } from 'express';
import { ARequest } from '../types/auth.request.type';
import { ApiError } from '../middleware/validate.request';
import { SystemRoleEnum } from '../models/system-role.model';
import userActivityService, { ActivityFilters } from '../services/user-activity.service';

const assertSuperAdmin = (req: ARequest) => {
  if (!req.user?.systemRoles?.includes(SystemRoleEnum.super_admin)) {
    throw ApiError.forbidden('Only super admins can access activity logs');
  }
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
    assertSuperAdmin(req);

    const filters  = extractFilters(req.query);
    const pageNum  = req.query.pageNum  ? parseInt(req.query.pageNum  as string, 10) : 1;
    const limit    = req.query.limit    ? parseInt(req.query.limit    as string, 10) : 20;

    const result = await userActivityService.list(filters, pageNum, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const exportActivities = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    assertSuperAdmin(req);

    const filters = extractFilters(req.query);
    const format  = (req.query.format as string) || 'json';
    const data    = await userActivityService.exportData(filters);

    if (format === 'csv') {
      const headers = [
        'timestamp', 'userName', 'email', 'role', 'department',
        'action', 'page', 'method', 'apiUrl', 'statusCode',
        'ipAddress', 'browser', 'os', 'deviceType',
      ];

      const escape = (v: any) => {
        const s = v == null ? '' : String(v);
        return s.includes(',') || s.includes('"') || s.includes('\n')
          ? `"${s.replace(/"/g, '""')}"` : s;
      };

      const rows = data.map((a: any) =>
        [
          a.timestamp, a.userName, a.email, a.role, a.department,
          a.action, a.page, a.method, a.apiUrl, a.statusCode,
          a.ipAddress, a.device?.browser, a.device?.os, a.device?.deviceType,
        ].map(escape).join(',')
      );

      const csv = [headers.join(','), ...rows].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="user-activity.csv"');
      return res.send(csv);
    }

    res.json({ data, total: data.length });
  } catch (error) {
    next(error);
  }
};
