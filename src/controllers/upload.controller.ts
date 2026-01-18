import { Request, Response, NextFunction } from "express";
import storage from "../config/storage.provider";
import { ApiError } from "../middleware/validate.request";

export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;

    if (!file) {
      throw ApiError.badRequest("No file uploaded");
    }

    const url = await storage.uploadFile(file);

    return res.json({ success: true, url });
  } catch (err: any) {
    // Handle multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(ApiError.badRequest("File size too large. Maximum size is 10MB"));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(ApiError.badRequest("Too many files uploaded"));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(ApiError.badRequest("Unexpected file field"));
    }
    
    next(err);
  }
};

export const uploadMultiple = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw ApiError.badRequest("No files uploaded");
    }

    const urls = await storage.uploadMultipleFiles(files);

    return res.json({ success: true, urls });
  } catch (err: any) {
    // Handle multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(ApiError.badRequest("File size too large. Maximum size is 10MB"));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(ApiError.badRequest("Too many files uploaded. Maximum is 10 files"));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(ApiError.badRequest("Unexpected file field"));
    }
    
    next(err);
  }
};
