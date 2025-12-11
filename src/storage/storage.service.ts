export interface StorageService {
  uploadFile(file: Express.Multer.File): Promise<string>;
  uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]>;
}
