import { Response, NextFunction } from 'express';
import { ARequest } from '../types/auth.request.type';
import userActivityService from '../services/user-activity.service';

const parseUserAgent = (ua: string = '') => {
  const browser =
    /Edg\//.test(ua)     ? 'Edge' :
    /Chrome\//.test(ua)  ? 'Chrome' :
    /Firefox\//.test(ua) ? 'Firefox' :
    /Safari\//.test(ua)  ? 'Safari' :
    /MSIE|Trident/.test(ua) ? 'IE' : 'Unknown';

  const os =
    /Windows/.test(ua)  ? 'Windows' :
    /Mac OS/.test(ua)   ? 'macOS' :
    /Android/.test(ua)  ? 'Android' :
    /iPhone|iPad/.test(ua) ? 'iOS' :
    /Linux/.test(ua)    ? 'Linux' : 'Unknown';

  const deviceType =
    /Mobi/.test(ua)  ? 'mobile' :
    /Tablet|iPad/.test(ua) ? 'tablet' : 'desktop';

  return { browser, os, deviceType, userAgent: ua };
};

export const userActivityMiddleware = (req: ARequest, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) return next();

  const startTime = Date.now();

  res.on('finish', () => {
    // skip internal/static/health endpoints
    if (req.originalUrl.startsWith('/uploads')) return;

    const ua  = req.headers['user-agent'] || '';
    const ip  =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    userActivityService.create({
      userId:     user._id,
      userName:   user.userName,
      email:      user.email,
      role:       (user as any).role,
      department: (user as any).department,
      action:     req.headers['x-action']    as string | undefined,
      page:       req.headers['x-page-name'] as string | undefined,
      apiUrl:     req.originalUrl,
      method:     req.method,
      statusCode: res.statusCode,
      ipAddress:  ip,
      device:     parseUserAgent(ua),
      timestamp:  new Date(startTime),
    } as any).catch((err) => console.error('[UserActivity] failed to log:', err));
  });

  next();
};
