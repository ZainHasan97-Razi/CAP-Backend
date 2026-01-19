import { Storage } from "@google-cloud/storage";
import { StorageService } from "./storage.service";

export default class GCPStorage implements StorageService {
  bucket: any;

  constructor() {
    const storage = new Storage({
      keyFilename: process.env.GCP_KEY_FILE,
      projectId: process.env.GCP_PROJECT_ID,
    });

    this.bucket = storage.bucket(process.env.GCP_BUCKET!);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const blob = this.bucket.file(Date.now() + "-" + file.originalname);

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.end(file.buffer);

    return `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((f) => this.uploadFile(f)));
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const fileName = fileUrl.split('/').pop();
      if (!fileName) return false;
      
      const file = this.bucket.file(fileName);
      await file.delete();
      return true;
    } catch (error) {
      return false;
    }
  }
}
