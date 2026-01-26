import { ARequest } from "types/auth.request.type";
import { Response, NextFunction } from "express";
import systemLogService from "../services/system-log.service";

export const systemLogMiddleware = (operation: string) => {
  return async (req: ARequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    const originalJson = res.json;
    
    let responseData: any;
    let responseCode: number = 200;
    let logged = false;

    // Intercept response
    res.send = function (data) {
      responseData = data;
      responseCode = res.statusCode;
      logResponse();
      return originalSend.call(this, data);
    };

    res.json = function (data) {
      responseData = data;
      responseCode = res.statusCode;
      logResponse();
      return originalJson.call(this, data);
    };

    const logResponse = () => {
      if (logged) return;
      logged = true;
      
      const logData = {
        apiUrl: req.originalUrl,
        requestData: { body: req.body, params: req.params, query: req.query },
        userId: req.user?.userName,
        responseCode: responseCode || res.statusCode
      };

      if ((responseCode || res.statusCode) >= 400) {
        systemLogService.logError(operation, responseData || 'Unknown error', logData);
      } else {
        systemLogService.logSuccess(operation, responseData, logData);
      }
    };

    next();
  };
};