import { Response, NextFunction } from 'express';
import { ARequest } from '../types/auth.request.type';
import { ApiError } from '../middleware/validate.request';
import { SystemRoleEnum } from '../models/system-role.model';
import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.join(process.cwd(), 'logs');

const assertSuperAdmin = (req: ARequest) => {
  if (!req.user?.systemRoles?.includes(SystemRoleEnum.super_admin)) {
    throw ApiError.forbidden('Only super admins can access system logs');
  }
};

const ensureLogsDir = () => {
  if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });
};

export const listLogFiles = (req: ARequest, res: Response, next: NextFunction) => {
  try {
    assertSuperAdmin(req);
    ensureLogsDir();

    const files = fs.readdirSync(LOGS_DIR)
      .filter(f => f.endsWith('.log'))
      .sort((a, b) => b.localeCompare(a)) // newest first
      .map(filename => {
        const stats = fs.statSync(path.join(LOGS_DIR, filename));
        return {
          filename,
          date:     filename.replace('.log', ''),
          sizeKb:   Math.round(stats.size / 1024),
          sizeBytes: stats.size,
        };
      });

    res.json({ data: files, total: files.length });
  } catch (error) {
    next(error);
  }
};

export const downloadLogFile = (req: ARequest, res: Response, next: NextFunction) => {
  try {
    assertSuperAdmin(req);

    const { filename } = req.params;

    // Sanitize — only allow YYYY-MM-DD.log pattern
    if (!/^\d{4}-\d{2}-\d{2}\.log$/.test(filename)) {
      throw ApiError.badRequest('Invalid filename format');
    }

    const filePath = path.join(LOGS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      throw ApiError.notFound('Log file not found');
    }

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    next(error);
  }
};
