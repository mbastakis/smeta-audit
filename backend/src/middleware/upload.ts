import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer disk storage configuration
// Upload to temp directory first, then move to final location in route handler
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Upload to temp directory - we'll move it later once we know pillar/category
    const tempPath = path.join(__dirname, '../../uploads/temp');
    
    // Create directory if it doesn't exist (recursive)
    try {
      fs.mkdirSync(tempPath, { recursive: true });
      cb(null, tempPath);
    } catch (error) {
      cb(error as Error, tempPath);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-extension
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname);
    const uniqueFilename = `${timestamp}-${randomStr}${ext}`;
    
    cb(null, uniqueFilename);
  }
});

// File type filter - only accept specific MIME types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx
    'image/jpeg',
    'image/png'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'));
  }
};

// Configure multer with storage, file filter, and size limits
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB in bytes
  }
});
