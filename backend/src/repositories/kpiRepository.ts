import { db } from '../database/db.js';
import type { KPIItem, KPIItemRow } from '../types/kpi.js';

function mapRowToKPIItem(row: KPIItemRow): KPIItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category as KPIItem['category'],
    fileType: row.file_type as KPIItem['fileType'],
    uploadDate: row.upload_date,
    folderPath: row.folder_path,
    hasIndexHtml: Boolean(row.has_index_html),
  };
}

export const kpiRepository = {
  getAll(): KPIItem[] {
    const rows = db.prepare('SELECT * FROM kpi_items ORDER BY upload_date DESC').all() as KPIItemRow[];
    return rows.map(mapRowToKPIItem);
  },

  getById(id: number): KPIItem | undefined {
    const row = db.prepare('SELECT * FROM kpi_items WHERE id = ?').get(id) as KPIItemRow | undefined;
    return row ? mapRowToKPIItem(row) : undefined;
  },

  getByCategory(category: string): KPIItem[] {
    const rows = db.prepare('SELECT * FROM kpi_items WHERE category = ? ORDER BY upload_date DESC').all(category) as KPIItemRow[];
    return rows.map(mapRowToKPIItem);
  },

  create(item: Omit<KPIItem, 'id' | 'uploadDate'>): KPIItem {
    const stmt = db.prepare(`
      INSERT INTO kpi_items (title, category, file_type, folder_path, has_index_html)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      item.title,
      item.category,
      item.fileType,
      item.folderPath,
      item.hasIndexHtml ? 1 : 0
    );

    const newItem = this.getById(result.lastInsertRowid as number);
    if (!newItem) {
      throw new Error('Failed to create KPI item');
    }

    return newItem;
  },

  delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM kpi_items WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },
};
