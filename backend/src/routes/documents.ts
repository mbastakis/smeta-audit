import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.js';
import { documentRepository } from '../repositories/documentRepository.js';
import fs from 'fs';
import path from 'path';

const router = Router();

/**
 * GET /api/documents/counts
 * Get document counts grouped by pillar and category
 */
router.get('/counts', async (req: Request, res: Response) => {
  try {
    const counts = documentRepository.getCounts();
    return res.status(200).json(counts);
  } catch (error) {
    console.error('Get counts error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve document counts'
    });
  }
});

/**
 * GET /api/documents
 * List all documents ordered by upload date (newest first)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const documents = documentRepository.findAll();
    return res.status(200).json(documents);
  } catch (error) {
    console.error('List documents error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve documents'
    });
  }
});

/**
 * GET /api/documents/pillar/:pillar/category/:category
 * List documents filtered by pillar and category
 */
router.get('/pillar/:pillar/category/:category', async (req: Request, res: Response) => {
  try {
    const { pillar, category } = req.params;

    // Validate pillar
    const validPillars = ['pillar-1', 'pillar-2', 'pillar-3', 'pillar-4', 'kpis', 'capa'];
    if (!validPillars.includes(pillar)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Invalid pillar. Must be one of: ${validPillars.join(', ')}`
      });
    }

    // Validate category
    const validCategories = ['policies', 'procedures', 'forms', 'evidence'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    const documents = documentRepository.findByPillarAndCategory(pillar, category);
    return res.status(200).json(documents);
  } catch (error) {
    console.error('Filter documents error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve documents'
    });
  }
});

/**
 * GET /api/documents/pillar/:pillar
 * List documents filtered by pillar
 */
router.get('/pillar/:pillar', async (req: Request, res: Response) => {
  try {
    const { pillar } = req.params;

    // Validate pillar
    const validPillars = ['pillar-1', 'pillar-2', 'pillar-3', 'pillar-4', 'kpis', 'capa'];
    if (!validPillars.includes(pillar)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Invalid pillar. Must be one of: ${validPillars.join(', ')}`
      });
    }

    const documents = documentRepository.findByPillar(pillar);
    return res.status(200).json(documents);
  } catch (error) {
    console.error('Filter documents by pillar error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve documents'
    });
  }
});

/**
 * GET /api/documents/:id/download
 * Download or view a document file
 */
router.get('/:id/download', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid document ID'
      });
    }

    // Get document metadata
    const document = documentRepository.findById(id);

    // Build absolute file path
    const filePath = path.join(process.cwd(), document.filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Document file not found on filesystem'
      });
    }

    // Set Content-Type header
    res.setHeader('Content-Type', document.fileType);

    // Set Content-Disposition (inline for PDFs, attachment for others)
    const disposition = document.fileType === 'application/pdf' ? 'inline' : 'attachment';
    res.setHeader('Content-Disposition', `${disposition}; filename="${document.originalFilename}"`);

    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        return res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to read document file'
        });
      }
    });

    fileStream.pipe(res);
  } catch (error: any) {
    console.error('Download document error:', error);

    // Handle document not found
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Document not found'
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to download document'
    });
  }
});

/**
 * GET /api/documents/:id
 * Get single document metadata by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid document ID'
      });
    }

    const document = documentRepository.findById(id);
    return res.status(200).json(document);
  } catch (error: any) {
    console.error('Get document error:', error);

    // Handle document not found
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Document not found'
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve document'
    });
  }
});

/**
 * DELETE /api/documents/:id
 * Delete a document (both database record and file)
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid document ID'
      });
    }

    // Get document metadata first (to get file path)
    const document = documentRepository.findById(id);

    // Delete database record
    documentRepository.deleteById(id);

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), document.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`File not found during deletion: ${filePath}`);
    }

    // Return 204 No Content
    return res.status(204).send();
  } catch (error: any) {
    console.error('Delete document error:', error);

    // Handle document not found
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Document not found'
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete document'
    });
  }
});

/**
 * POST /api/documents/upload
 * Upload a document with metadata
 */
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    // Validate required fields
    if (!req.file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'File is required'
      });
    }

    const { pillar, category } = req.body;
    let { displayName } = req.body;

    // Validate and sanitize display name
    if (displayName !== undefined && displayName !== null && displayName !== '') {
      displayName = displayName.trim();
      
      if (displayName.length === 0) {
        displayName = null; // Treat empty string as null
      } else if (displayName.length > 255) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Display name must be 255 characters or less'
        });
      } else if (/[\/\\<>:"|?*\x00-\x1F]/.test(displayName)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Display name contains invalid characters (/, \\, <, >, :, ", |, ?, *)'
        });
      }
    } else {
      displayName = null;
    }

    if (!pillar) {
      // Clean up uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Pillar is required'
      });
    }

    // Validate pillar value
    const validPillars = ['pillar-1', 'pillar-2', 'pillar-3', 'pillar-4', 'kpis', 'capa'];
    if (!validPillars.includes(pillar)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Bad Request',
        message: `Invalid pillar. Must be one of: ${validPillars.join(', ')}`
      });
    }

    // Validate category if provided
    if (category) {
      const validCategories = ['policies', 'procedures', 'forms', 'evidence'];
      if (!validCategories.includes(category)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          error: 'Bad Request',
          message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
        });
      }
    }

    // Move file from temp to final location
    const finalDir = category 
      ? path.join(path.dirname(req.file.path), '../', pillar, category)
      : path.join(path.dirname(req.file.path), '../', pillar);
    
    // Create final directory if it doesn't exist
    fs.mkdirSync(finalDir, { recursive: true });
    
    const finalPath = path.join(finalDir, req.file.filename);
    fs.renameSync(req.file.path, finalPath);

    // Build relative file path for database storage
    const relativePath = category
      ? path.join('backend/uploads', pillar, category, req.file.filename)
      : path.join('backend/uploads', pillar, req.file.filename);

    // Insert document metadata into database
    const document = documentRepository.insertDocument({
      filename: req.file.filename,
      originalFilename: req.file.originalname,
      displayName: displayName,
      pillar,
      category: category || null,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: relativePath
    });

    // Return 201 Created with document metadata
    return res.status(201).json({
      id: document.id,
      filename: document.filename,
      originalFilename: document.originalFilename,
      displayName: document.displayName,
      pillar: document.pillar,
      category: document.category,
      fileType: document.fileType,
      fileSize: document.fileSize,
      uploadDate: document.uploadDate,
      filePath: document.filePath
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Failed to clean up file:', cleanupError);
      }
    }

    console.error('Upload error:', error);
    
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to upload document'
    });
  }
});

/**
 * Multer error handler middleware
 */
router.use((error: any, req: Request, res: Response, next: any) => {
  if (error instanceof Error) {
    // Handle multer-specific errors
    if (error.message === 'Unsupported file type') {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'File type not supported. Allowed types: PDF, DOCX, XLSX, JPG, PNG'
      });
    }
    
    if (error.message.includes('File too large')) {
      return res.status(413).json({
        error: 'Payload Too Large',
        message: 'File size exceeds 50MB limit'
      });
    }
  }

  // Pass to global error handler
  next(error);
});

export default router;
