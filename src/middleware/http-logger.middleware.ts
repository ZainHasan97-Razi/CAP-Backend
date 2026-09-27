import { Request, Response, NextFunction } from 'express';
import { ARequest } from '../types/auth.request.type';
import logger from '../utils/logger';

export const httpLoggerMiddleware = (req: ARequest, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    if (req.originalUrl.startsWith('/uploads')) return;

    const duration = Date.now() - startTime;
    const level    = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    logger.log(level, 'HTTP', {
      method:     req.method,
      url:        req.originalUrl,
      statusCode: res.statusCode,
      duration:   `${duration}ms`,
      userId:     (req as ARequest).user?.userName ?? null,
      ip:         (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress,
      body:       req.method !== 'GET' ? req.body : undefined,
      query:      Object.keys(req.query).length ? req.query : undefined,
    });
  });

  next();
};
