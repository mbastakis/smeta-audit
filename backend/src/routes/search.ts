import { Router, Request, Response } from 'express';
import { documentRepository } from '../repositories/documentRepository.js';

const router = Router();

/**
 * GET /api/search?q={searchTerm}
 * Search documents by filename, pillar, or category
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;

    // Validate search term exists
    if (!searchTerm || searchTerm.trim() === '') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search term required'
      });
    }

    // Validate minimum length (2 characters)
    if (searchTerm.trim().length < 2) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search term must be at least 2 characters'
      });
    }

    // Perform search using repository
    const results = documentRepository.search(searchTerm.trim());

    return res.status(200).json({
      query: searchTerm,
      count: results.length,
      results
    });

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to perform search'
    });
  }
});

export default router;
