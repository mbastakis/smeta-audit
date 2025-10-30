import { Router, Request, Response } from 'express';
import { kpiRepository } from '../repositories/kpiRepository.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// @ts-ignore - unzipper doesn't have type definitions
import unzipper from 'unzipper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Multer storage for KPI uploads (single file or ZIP)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempPath = path.join(__dirname, '../../uploads/temp');
    fs.mkdirSync(tempPath, { recursive: true });
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${randomStr}${ext}`);
  }
});

// File filter for KPI uploads (allow ZIP for HTML packages)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream' // Some systems send ZIP as octet-stream
  ];
  
  console.log('Upload file MIME type:', file.mimetype, 'Original name:', file.originalname);
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`));
  }
};

const uploadKPI = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB for ZIP files
});

// GET /api/kpis - List all KPI items
router.get('/', (req: Request, res: Response) => {
  try {
    const items = kpiRepository.getAll();
    res.json({ items });
  } catch (error) {
    console.error('Error fetching KPI items:', error);
    res.status(500).json({ error: 'Failed to fetch KPI items' });
  }
});

// GET /api/kpis/category/:category - List items by category
router.get('/category/:category', (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const items = kpiRepository.getByCategory(category);
    res.json({ items });
  } catch (error) {
    console.error('Error fetching KPI items by category:', error);
    res.status(500).json({ error: 'Failed to fetch KPI items' });
  }
});

// POST /api/kpis/upload - Upload single file or HTML package
router.post('/upload', uploadKPI.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, category, fileType } = req.body;

    if (!title || !category || !fileType) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Missing required fields: title, category, fileType' });
    }

    // Generate unique folder for this item
    const itemId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const itemFolder = path.join(__dirname, '../../uploads/kpis', category, itemId);
    fs.mkdirSync(itemFolder, { recursive: true });

    let hasIndexHtml = false;

    if (fileType === 'html-package') {
      // Extract ZIP file
      try {
        await fs.createReadStream(req.file.path)
          .pipe(unzipper.Extract({ path: itemFolder }))
          .promise();

        // Verify index.html exists
        const indexPath = path.join(itemFolder, 'index.html');
        if (!fs.existsSync(indexPath)) {
          // Clean up
          fs.rmSync(itemFolder, { recursive: true, force: true });
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: 'HTML package must contain index.html' });
        }

        hasIndexHtml = true;

        // Delete temp ZIP file
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error('Error extracting ZIP:', error);
        fs.rmSync(itemFolder, { recursive: true, force: true });
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: 'Failed to extract ZIP file' });
      }
    } else {
      // Move single file to item folder
      const fileName = req.file.originalname;
      const destPath = path.join(itemFolder, fileName);
      fs.renameSync(req.file.path, destPath);
    }

    // Create database record
    const kpiItem = kpiRepository.create({
      title,
      category,
      fileType,
      folderPath: itemFolder,
      hasIndexHtml,
    });

    res.status(201).json({ item: kpiItem });
  } catch (error) {
    console.error('Error uploading KPI item:', error);
    res.status(500).json({ error: 'Failed to upload KPI item' });
  }
});

// GET /api/kpis/:id/view - Serve HTML package or download single file
router.get('/:id/view', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = kpiRepository.getById(id);

    if (!item) {
      return res.status(404).json({ error: 'KPI item not found' });
    }

    if (item.hasIndexHtml) {
      // Resolve folder path - handle both absolute and relative paths
      let folderPath = item.folderPath;
      
      // If the stored path is absolute but doesn't exist, try to reconstruct it
      if (path.isAbsolute(folderPath) && !fs.existsSync(folderPath)) {
        const uploadsIndex = folderPath.indexOf('/uploads/kpis/');
        if (uploadsIndex !== -1) {
          const relativePath = folderPath.substring(uploadsIndex + 1);
          folderPath = path.join(process.cwd(), 'backend', relativePath);
        }
      }

      // Serve index.html with security headers
      const indexPath = path.join(folderPath, 'index.html');
      res.sendFile(indexPath, {
        headers: {
          'X-Frame-Options': 'SAMEORIGIN',
          'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;"
        }
      });
    } else {
      // Redirect to download for single files
      res.redirect(`/api/kpis/${id}/download`);
    }
  } catch (error) {
    console.error('Error viewing KPI item:', error);
    res.status(500).json({ error: 'Failed to view KPI item' });
  }
});

// GET /api/kpis/:id/download - Download single file
router.get('/:id/download', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = kpiRepository.getById(id);

    if (!item) {
      return res.status(404).json({ error: 'KPI item not found' });
    }

    // Resolve folder path - handle both absolute and relative paths
    let folderPath = item.folderPath;
    
    // If the stored path is absolute but doesn't exist, try to reconstruct it
    if (path.isAbsolute(folderPath) && !fs.existsSync(folderPath)) {
      // Extract the relative path from uploads directory onwards
      const uploadsIndex = folderPath.indexOf('/uploads/kpis/');
      if (uploadsIndex !== -1) {
        const relativePath = folderPath.substring(uploadsIndex + 1); // Remove leading slash
        folderPath = path.join(process.cwd(), 'backend', relativePath);
      }
    }

    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      console.error('Folder not found:', folderPath, 'Original:', item.folderPath);
      return res.status(404).json({ error: 'KPI folder not found' });
    }

    // Find the file in the folder
    const files = fs.readdirSync(folderPath);
    if (files.length === 0) {
      return res.status(404).json({ error: 'No files found' });
    }

    const filePath = path.join(folderPath, files[0]);
    res.download(filePath);
  } catch (error) {
    console.error('Error downloading KPI item:', error);
    res.status(500).json({ error: 'Failed to download KPI item' });
  }
});

// Serve static assets for HTML packages (CSS, JS, images, etc.)
// This catches requests like /api/kpis/3/style.css, /api/kpis/3/script.js, etc.
router.get('/:id/:filename', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const filename = req.params.filename;
    const item = kpiRepository.getById(id);

    if (!item || !item.hasIndexHtml) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Resolve folder path - handle both absolute and relative paths
    let folderPath = item.folderPath;
    
    // If the stored path is absolute but doesn't exist, try to reconstruct it
    if (path.isAbsolute(folderPath) && !fs.existsSync(folderPath)) {
      const uploadsIndex = folderPath.indexOf('/uploads/kpis/');
      if (uploadsIndex !== -1) {
        const relativePath = folderPath.substring(uploadsIndex + 1);
        folderPath = path.join(__dirname, '../../', relativePath);
      }
    }

    // Serve the requested file from the folder
    const filePath = path.join(folderPath, filename);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(folderPath)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving asset:', error);
    res.status(500).json({ error: 'Failed to serve asset' });
  }
});

// DELETE /api/kpis/:id - Delete KPI item
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = kpiRepository.getById(id);

    if (!item) {
      return res.status(404).json({ error: 'KPI item not found' });
    }

    // Delete files/folder
    if (fs.existsSync(item.folderPath)) {
      fs.rmSync(item.folderPath, { recursive: true, force: true });
    }

    // Delete database record
    const deleted = kpiRepository.delete(id);

    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete from database' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting KPI item:', error);
    res.status(500).json({ error: 'Failed to delete KPI item' });
  }
});

export default router;
