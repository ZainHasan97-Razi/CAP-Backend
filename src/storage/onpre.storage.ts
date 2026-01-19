import axios from "axios";
import { StorageService } from "./storage.service";

export default class OnPremStorage implements StorageService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const response = await axios.post(
      process.env.ONPREM_UPLOAD_URL!,
      {
        file: file.buffer.toString("base64"),
        originalname: file.originalname,
      }
    );

    return response.data.url; // on-prem returns uploaded file URL
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((f) => this.uploadFile(f)));
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const response = await axios.delete(process.env.ONPREM_DELETE_URL!, {
        data: { fileUrl }
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}
