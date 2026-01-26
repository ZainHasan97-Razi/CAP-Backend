import { ARequest } from "types/auth.request.type";
import { Response, NextFunction } from "express";
import systemLogService from "../services/system-log.service";

export function SystemLog(operation: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (req: ARequest, res: Response, next: NextFunction) {
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

      try {
        const result = await method.apply(this, [req, res, next]);
        
        // Log success
        await systemLogService.logSuccess(operation, responseData, {
          controllerName: target.constructor.name,
          apiUrl: req.originalUrl,
          requestData: { body: req.body, params: req.params, query: req.query },
          userId: req.user?.userName,
          responseCode
        });

        return result;
      } catch (error) {
        // Log error
        await systemLogService.logError(operation, error, {
          controllerName: target.constructor.name,
          apiUrl: req.originalUrl,
          requestData: { body: req.body, params: req.params, query: req.query },
          userId: req.user?.userName
        });

        throw error;
      }
    };
  };
}