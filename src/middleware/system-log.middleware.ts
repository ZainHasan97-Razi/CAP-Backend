import { ARequest } from "types/auth.request.type";
import { Response, NextFunction } from "express";
import systemLogService from "../services/system-log.service";

export const systemLogMiddleware = (operation: string) => {
  return async (req: ARequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    const originalJson = res.json;
    
    let responseData: any;
    let responseCode: number;

    // Intercept response
    res.send = function (data) {
      responseData = data;
      responseCode = res.statusCode;
      return originalSend.call(this, data);
    };

    res.json = function (data) {
      responseData = data;
      responseCode = res.statusCode;
      return originalJson.call(this, data);
    };

    // Override res.end to capture final response
    const originalEnd = res.end;
    res.end = function (...args) {
      // Log the request/response
      const logData = {
        apiUrl: req.originalUrl,
        requestData: { body: req.body, params: req.params, query: req.query },
        userId: req.user?.userName,
        responseCode: responseCode || res.statusCode
      };

      if (responseCode >= 400) {
        systemLogService.logError(operation, responseData || 'Unknown error', logData);
      } else {
        systemLogService.logSuccess(operation, responseData, logData);
      }

      return originalEnd.apply(this, args);
    };

    next();
  };
};