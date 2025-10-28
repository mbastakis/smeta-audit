import { Router, Request, Response } from 'express';
import { capaRepository } from '../repositories/capaRepository.js';
import type { CAPACreateRequest, CAPAUpdateRequest } from '../types/capa.js';

const router = Router();

/**
 * GET /api/capas
 * Get all CAPAs
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const capas = capaRepository.findAll();
    return res.status(200).json(capas);
  } catch (error) {
    console.error('Get all CAPAs error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve CAPAs'
    });
  }
});

/**
 * GET /api/capas/status/:status
 * Get CAPAs by status
 */
router.get('/status/:status', async (req: Request, res: Response) => {
  try {
    const { status } = req.params;

    // Validate status
    const validStatuses = ['open', 'in-progress', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const capas = capaRepository.findByStatus(status);
    return res.status(200).json(capas);
  } catch (error) {
    console.error('Get CAPAs by status error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve CAPAs'
    });
  }
});

/**
 * GET /api/capas/:id
 * Get single CAPA by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid CAPA ID'
      });
    }

    const capa = capaRepository.findById(id);
    return res.status(200).json(capa);
  } catch (error: any) {
    console.error('Get CAPA error:', error);

    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'CAPA not found'
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve CAPA'
    });
  }
});

/**
 * POST /api/capas
 * Create new CAPA
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body as CAPACreateRequest;

    // Validate required fields
    if (!data.capaId || !data.capaId.trim()) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'CAPA ID is required'
      });
    }

    if (!data.description || !data.description.trim()) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Description is required'
      });
    }

    // Check for duplicate capa_id
    if (capaRepository.existsByCapaId(data.capaId)) {
      return res.status(409).json({
        error: 'Conflict',
        message: `CAPA ID "${data.capaId}" already exists`
      });
    }

    // Validate status if provided
    if (data.status) {
      const validStatuses = ['open', 'in-progress', 'closed'];
      if (!validStatuses.includes(data.status)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    // Validate pillar if provided
    if (data.pillar) {
      const validPillars = ['pillar-1', 'pillar-2', 'pillar-3', 'pillar-4'];
      if (!validPillars.includes(data.pillar)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: `Invalid pillar. Must be one of: ${validPillars.join(', ')}`
        });
      }
    }

    // Validate severity if provided
    if (data.severity) {
      const validSeverities = ['critical', 'major', 'minor', 'observation'];
      if (!validSeverities.includes(data.severity)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: `Invalid severity. Must be one of: ${validSeverities.join(', ')}`
        });
      }
    }

    const capa = capaRepository.create(data);
    return res.status(201).json(capa);
  } catch (error) {
    console.error('Create CAPA error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create CAPA'
    });
  }
});

/**
 * PUT /api/capas/:id
 * Update existing CAPA
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid CAPA ID'
      });
    }

    const data = req.body as CAPAUpdateRequest;

    // Get current CAPA to check for status changes
    let previousStatus: string | undefined;
    try {
      const currentCapa = capaRepository.findById(id);
      previousStatus = currentCapa.status;
    } catch (error) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'CAPA not found'
      });
    }

    // Check for duplicate capa_id if updating
    if (data.capaId && capaRepository.existsByCapaId(data.capaId, id)) {
      return res.status(409).json({
        error: 'Conflict',
        message: `CAPA ID "${data.capaId}" already exists`
      });
    }

    // Validate status if provided
    if (data.status) {
      const validStatuses = ['open', 'in-progress', 'closed'];
      if (!validStatuses.includes(data.status)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    const capa = capaRepository.update(id, data, previousStatus);
    return res.status(200).json(capa);
  } catch (error: any) {
    console.error('Update CAPA error:', error);

    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'CAPA not found'
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update CAPA'
    });
  }
});

/**
 * DELETE /api/capas/:id
 * Delete CAPA
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid CAPA ID'
      });
    }

    capaRepository.deleteById(id);
    return res.status(204).send();
  } catch (error: any) {
    console.error('Delete CAPA error:', error);

    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'CAPA not found'
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete CAPA'
    });
  }
});

export default router;
