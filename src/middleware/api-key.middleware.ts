import { Request, Response, NextFunction } from 'express';
import { ApiError } from './validate.request';

export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const key = req.headers['x-api-key'];
  if (!key || key !== process.env.AI_API_KEY) {
    return next(ApiError.unauthorized('Invalid or missing API key'));
  }
  next();
};

export const requireWebhookSecret = (req: Request, res: Response, next: NextFunction) => {
  const secret = req.headers['x-webhook-secret'];
  if (!secret || secret !== process.env.AI_WEBHOOK_SECRET) {
    return next(ApiError.unauthorized('Invalid or missing webhook secret'));
  }
  next();
};
