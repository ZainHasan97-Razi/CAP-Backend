import multer from "multer";

// Store in memory because final upload goes to cloud/on-prem
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default upload;
