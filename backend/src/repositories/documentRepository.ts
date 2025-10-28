import { db } from '../database/db.js';
import type { Document, DocumentInsert } from '../types/document.js';

export class DocumentRepository {
  /**
   * Insert a new document into the database
   */
  insertDocument(doc: DocumentInsert): Document {
    const stmt = db.prepare(`
      INSERT INTO documents (filename, original_filename, pillar, category, 
                            file_type, file_size, file_path)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      doc.filename,
      doc.originalFilename,
      doc.pillar,
      doc.category,
      doc.fileType,
      doc.fileSize,
      doc.filePath
    );
    
    const insertedId = result.lastInsertRowid as number;
    return this.findById(insertedId);
  }

  /**
   * Find a document by ID
   */
  findById(id: number): Document {
    const stmt = db.prepare(`
      SELECT 
        id,
        filename,
        original_filename as originalFilename,
        pillar,
        category,
        file_type as fileType,
        file_size as fileSize,
        upload_date as uploadDate,
        file_path as filePath
      FROM documents
      WHERE id = ?
    `);
    
    const doc = stmt.get(id) as Document;
    
    if (!doc) {
      throw new Error(`Document with ID ${id} not found`);
    }
    
    return doc;
  }

  /**
   * Find all documents
   */
  findAll(): Document[] {
    const stmt = db.prepare(`
      SELECT 
        id,
        filename,
        original_filename as originalFilename,
        pillar,
        category,
        file_type as fileType,
        file_size as fileSize,
        upload_date as uploadDate,
        file_path as filePath
      FROM documents
      ORDER BY upload_date DESC
    `);
    
    return stmt.all() as Document[];
  }

  /**
   * Find documents by pillar
   */
  findByPillar(pillar: string): Document[] {
    const stmt = db.prepare(`
      SELECT 
        id,
        filename,
        original_filename as originalFilename,
        pillar,
        category,
        file_type as fileType,
        file_size as fileSize,
        upload_date as uploadDate,
        file_path as filePath
      FROM documents
      WHERE pillar = ?
      ORDER BY upload_date DESC
    `);
    
    return stmt.all(pillar) as Document[];
  }

  /**
   * Find documents by pillar and category
   */
  findByPillarAndCategory(pillar: string, category: string): Document[] {
    const stmt = db.prepare(`
      SELECT 
        id,
        filename,
        original_filename as originalFilename,
        pillar,
        category,
        file_type as fileType,
        file_size as fileSize,
        upload_date as uploadDate,
        file_path as filePath
      FROM documents
      WHERE pillar = ? AND category = ?
      ORDER BY upload_date DESC
    `);
    
    return stmt.all(pillar, category) as Document[];
  }

  /**
   * Delete a document by ID
   */
  deleteById(id: number): void {
    const stmt = db.prepare('DELETE FROM documents WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      throw new Error(`Document with ID ${id} not found`);
    }
  }

  /**
   * Get document counts grouped by pillar and category
   */
  getCounts(): any {
    const stmt = db.prepare(`
      SELECT 
        pillar,
        category,
        COUNT(*) as count
      FROM documents
      GROUP BY pillar, category
    `);
    
    const rows = stmt.all() as Array<{ pillar: string; category: string | null; count: number }>;
    
    // Build nested object structure
    const counts: any = {};
    let grandTotal = 0;
    
    rows.forEach(row => {
      if (!counts[row.pillar]) {
        counts[row.pillar] = { total: 0 };
      }
      
      if (row.category) {
        counts[row.pillar][row.category] = row.count;
      }
      
      counts[row.pillar].total += row.count;
      grandTotal += row.count;
    });
    
    counts.grandTotal = grandTotal;
    
    return counts;
  }

  /**
   * Search documents by filename, pillar, or category
   * Returns results ordered by relevance
   */
  search(searchTerm: string): Document[] {
    const searchPattern = `%${searchTerm}%`;
    
    // Search with relevance scoring:
    // 1 = exact original_filename match (case-insensitive)
    // 2 = original_filename contains search term
    // 3 = filename contains search term
    // 4 = pillar or category contains search term
    const stmt = db.prepare(`
      SELECT 
        id,
        filename,
        original_filename as originalFilename,
        pillar,
        category,
        file_type as fileType,
        file_size as fileSize,
        upload_date as uploadDate,
        file_path as filePath,
        CASE
          WHEN LOWER(original_filename) = LOWER(?) THEN 1
          WHEN LOWER(original_filename) LIKE LOWER(?) THEN 2
          WHEN LOWER(filename) LIKE LOWER(?) THEN 3
          WHEN LOWER(pillar) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?) THEN 4
          ELSE 5
        END as relevance
      FROM documents
      WHERE 
        LOWER(original_filename) LIKE LOWER(?)
        OR LOWER(filename) LIKE LOWER(?)
        OR LOWER(pillar) LIKE LOWER(?)
        OR LOWER(category) LIKE LOWER(?)
      ORDER BY relevance ASC, upload_date DESC
      LIMIT 50
    `);
    
    // Bind parameters: searchTerm, searchPattern (multiple times for different fields)
    const results = stmt.all(
      searchTerm,           // For exact match
      searchPattern,        // For original_filename LIKE
      searchPattern,        // For filename LIKE
      searchPattern,        // For pillar LIKE
      searchPattern,        // For category LIKE
      searchPattern,        // WHERE original_filename LIKE
      searchPattern,        // WHERE filename LIKE
      searchPattern,        // WHERE pillar LIKE
      searchPattern         // WHERE category LIKE
    ) as Document[];
    
    return results;
  }
}

export const documentRepository = new DocumentRepository();
