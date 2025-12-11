import { StorageService } from "./storage.service";
import fs from "fs";
import path from "path";

export default class LocalDiskStorage implements StorageService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadPath = path.join("uploads", Date.now() + "-" + file.originalname);

    fs.writeFileSync(uploadPath, file.buffer);

    return uploadPath;
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((f) => this.uploadFile(f)));
  }
}
