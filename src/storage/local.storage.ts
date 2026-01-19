import { StorageService } from "./storage.service";
import fs from "fs";
import path from "path";

export default class LocalDiskStorage implements StorageService {
  private ensureUploadDir() {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = this.ensureUploadDir();
    const fileName = Date.now() + "-" + file.originalname;
    const uploadPath = path.join(uploadDir, fileName);

    fs.writeFileSync(uploadPath, file.buffer);

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.BACKEND_URL || 'http://localhost:9000'
      : `http://localhost:${process.env.PORT || 9000}`;
    
    return `${baseUrl}/uploads/${fileName}`;
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((f) => this.uploadFile(f)));
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const fileName = fileUrl.split('/uploads/').pop();
      if (!fileName) return false;
      
      const filePath = path.join(process.cwd(), "uploads", fileName);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }
}
