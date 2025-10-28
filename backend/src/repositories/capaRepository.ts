import { db } from '../database/db.js';
import type { CAPA, CAPACreateRequest, CAPAUpdateRequest } from '../types/capa.js';

export class CAPARepository {
  /**
   * Find all CAPAs ordered by date_opened DESC
   */
  findAll(): CAPA[] {
    const stmt = db.prepare(`
      SELECT 
        id,
        capa_id as capaId,
        description,
        pillar,
        severity,
        status,
        date_opened as dateOpened,
        date_due as dateDue,
        date_closed as dateClosed,
        root_cause as rootCause,
        corrective_action as correctiveAction,
        preventive_action as preventiveAction
      FROM capas
      ORDER BY date_opened DESC
    `);
    
    return stmt.all() as CAPA[];
  }

  /**
   * Find CAPA by ID
   */
  findById(id: number): CAPA {
    const stmt = db.prepare(`
      SELECT 
        id,
        capa_id as capaId,
        description,
        pillar,
        severity,
        status,
        date_opened as dateOpened,
        date_due as dateDue,
        date_closed as dateClosed,
        root_cause as rootCause,
        corrective_action as correctiveAction,
        preventive_action as preventiveAction
      FROM capas
      WHERE id = ?
    `);
    
    const capa = stmt.get(id) as CAPA;
    
    if (!capa) {
      throw new Error(`CAPA with ID ${id} not found`);
    }
    
    return capa;
  }

  /**
   * Find CAPAs by status
   */
  findByStatus(status: string): CAPA[] {
    const stmt = db.prepare(`
      SELECT 
        id,
        capa_id as capaId,
        description,
        pillar,
        severity,
        status,
        date_opened as dateOpened,
        date_due as dateDue,
        date_closed as dateClosed,
        root_cause as rootCause,
        corrective_action as correctiveAction,
        preventive_action as preventiveAction
      FROM capas
      WHERE status = ?
      ORDER BY date_opened DESC
    `);
    
    return stmt.all(status) as CAPA[];
  }

  /**
   * Check if capa_id already exists
   */
  existsByCapaId(capaId: string, excludeId?: number): boolean {
    let stmt;
    let result;
    
    if (excludeId) {
      stmt = db.prepare('SELECT COUNT(*) as count FROM capas WHERE capa_id = ? AND id != ?');
      result = stmt.get(capaId, excludeId) as { count: number };
    } else {
      stmt = db.prepare('SELECT COUNT(*) as count FROM capas WHERE capa_id = ?');
      result = stmt.get(capaId) as { count: number };
    }
    
    return result.count > 0;
  }

  /**
   * Create new CAPA
   */
  create(data: CAPACreateRequest): CAPA {
    const stmt = db.prepare(`
      INSERT INTO capas (
        capa_id, description, pillar, severity, status,
        date_opened, date_due, root_cause, corrective_action, preventive_action
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const dateOpened = data.dateOpened || new Date().toISOString();
    const status = data.status || 'open';
    
    const result = stmt.run(
      data.capaId,
      data.description,
      data.pillar || null,
      data.severity || null,
      status,
      dateOpened,
      data.dateDue || null,
      data.rootCause || null,
      data.correctiveAction || null,
      data.preventiveAction || null
    );
    
    const insertedId = result.lastInsertRowid as number;
    return this.findById(insertedId);
  }

  /**
   * Update existing CAPA
   */
  update(id: number, data: CAPAUpdateRequest, previousStatus?: string): CAPA {
    // Build dynamic update query based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    
    if (data.capaId !== undefined) {
      updates.push('capa_id = ?');
      values.push(data.capaId);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }
    if (data.pillar !== undefined) {
      updates.push('pillar = ?');
      values.push(data.pillar);
    }
    if (data.severity !== undefined) {
      updates.push('severity = ?');
      values.push(data.severity);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
      
      // Auto-set date_closed when status changes to 'closed'
      if (data.status === 'closed' && previousStatus !== 'closed') {
        updates.push('date_closed = ?');
        values.push(new Date().toISOString());
      }
    }
    if (data.dateDue !== undefined) {
      updates.push('date_due = ?');
      values.push(data.dateDue);
    }
    if (data.dateClosed !== undefined) {
      updates.push('date_closed = ?');
      values.push(data.dateClosed);
    }
    if (data.rootCause !== undefined) {
      updates.push('root_cause = ?');
      values.push(data.rootCause);
    }
    if (data.correctiveAction !== undefined) {
      updates.push('corrective_action = ?');
      values.push(data.correctiveAction);
    }
    if (data.preventiveAction !== undefined) {
      updates.push('preventive_action = ?');
      values.push(data.preventiveAction);
    }
    
    if (updates.length === 0) {
      // No updates provided, return existing record
      return this.findById(id);
    }
    
    values.push(id);
    
    const stmt = db.prepare(`
      UPDATE capas
      SET ${updates.join(', ')}
      WHERE id = ?
    `);
    
    const result = stmt.run(...values);
    
    if (result.changes === 0) {
      throw new Error(`CAPA with ID ${id} not found`);
    }
    
    return this.findById(id);
  }

  /**
   * Delete CAPA by ID
   */
  deleteById(id: number): void {
    const stmt = db.prepare('DELETE FROM capas WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      throw new Error(`CAPA with ID ${id} not found`);
    }
  }
}

export const capaRepository = new CAPARepository();
