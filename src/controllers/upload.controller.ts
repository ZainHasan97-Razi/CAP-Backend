import { Request, Response, NextFunction } from "express";
import storage from "../config/storage.provider";

export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const url = await storage.uploadFile(file);

    return res.json({ success: true, url });
  } catch (err) {
    next(err);
  }
};

export const uploadMultiple = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const urls = await storage.uploadMultipleFiles(files);

    return res.json({ success: true, urls });
  } catch (err) {
    next(err);
  }
};
