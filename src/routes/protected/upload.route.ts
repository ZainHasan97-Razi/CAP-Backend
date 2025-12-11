import { Router } from "express";
import upload from "../../config/multer.config";
import { uploadSingle, uploadMultiple } from "../../controllers/upload.controller";

const router = Router();

// Single file upload
router.post("/single", upload.single("file"), uploadSingle);

// Multiple files upload
router.post("/multiple", upload.array("files", 10), uploadMultiple);

export default router;
