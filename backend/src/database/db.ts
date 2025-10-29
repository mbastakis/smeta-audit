import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || '../data/smeta.db';
const dbPath = path.resolve(__dirname, '../../', DB_PATH);

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`✓ Created data directory: ${dataDir}`);
}

// Initialize database connection
export const db: Database.Database = new Database(dbPath);
db.pragma('journal_mode = WAL'); // Enable Write-Ahead Logging for better concurrency

console.log(`✓ Database connected: ${dbPath}`);

// Initialize database schema
export function initializeDatabase() {
  console.log('Initializing database schema...');

  // Create documents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_filename TEXT NOT NULL,
      display_name TEXT,
      pillar TEXT NOT NULL CHECK(pillar IN ('pillar-1', 'pillar-2', 'pillar-3', 'pillar-4', 'kpis', 'capa')),
      category TEXT CHECK(category IN ('policies', 'procedures', 'forms', 'evidence') OR category IS NULL),
      file_type TEXT NOT NULL,
      file_size INTEGER NOT NULL CHECK(file_size > 0),
      upload_date TEXT NOT NULL DEFAULT (datetime('now')),
      file_path TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Create indexes for documents
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_documents_pillar ON documents(pillar);
    CREATE INDEX IF NOT EXISTS idx_documents_pillar_category ON documents(pillar, category);
    CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON documents(upload_date DESC);
  `);

  // Create trigger for documents updated_at
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_documents_timestamp 
    AFTER UPDATE ON documents
    BEGIN
      UPDATE documents SET updated_at = datetime('now') WHERE id = NEW.id;
    END;
  `);

  console.log('✓ Documents table created');

  // Migration: Add display_name column if it doesn't exist
  const tableInfo = db.prepare('PRAGMA table_info(documents)').all() as Array<{ name: string }>;
  const hasDisplayName = tableInfo.some(col => col.name === 'display_name');
  
  if (!hasDisplayName) {
    console.log('Running migration: Adding display_name column to documents table...');
    db.exec('ALTER TABLE documents ADD COLUMN display_name TEXT');
    console.log('✓ Migration complete: display_name column added');
  }

  // Create capas table
  db.exec(`
    CREATE TABLE IF NOT EXISTS capas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      capa_id TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      pillar TEXT CHECK(pillar IN ('pillar-1', 'pillar-2', 'pillar-3', 'pillar-4') OR pillar IS NULL),
      severity TEXT CHECK(severity IN ('critical', 'major', 'minor', 'observation') OR severity IS NULL),
      status TEXT NOT NULL CHECK(status IN ('open', 'in-progress', 'closed')) DEFAULT 'open',
      date_opened TEXT NOT NULL DEFAULT (datetime('now')),
      date_due TEXT,
      date_closed TEXT,
      root_cause TEXT,
      corrective_action TEXT,
      preventive_action TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Create indexes for capas
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_capas_status ON capas(status);
    CREATE INDEX IF NOT EXISTS idx_capas_pillar ON capas(pillar);
  `);

  // Create trigger for capas updated_at
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_capas_timestamp 
    AFTER UPDATE ON capas
    BEGIN
      UPDATE capas SET updated_at = datetime('now') WHERE id = NEW.id;
    END;
  `);

  console.log('✓ CAPAs table created');

  // Create kpi_items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS kpi_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('statistics', 'research', 'kpis', 'org-chart', 'business-plan')),
      file_type TEXT NOT NULL CHECK(file_type IN ('pdf', 'xlsx', 'docx', 'jpg', 'png', 'html-package')),
      upload_date TEXT NOT NULL DEFAULT (datetime('now')),
      folder_path TEXT NOT NULL UNIQUE,
      has_index_html BOOLEAN NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Create indexes for kpi_items
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_kpi_items_category ON kpi_items(category);
    CREATE INDEX IF NOT EXISTS idx_kpi_items_type ON kpi_items(file_type);
  `);

  // Create trigger for kpi_items updated_at
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_kpi_items_timestamp 
    AFTER UPDATE ON kpi_items
    BEGIN
      UPDATE kpi_items SET updated_at = datetime('now') WHERE id = NEW.id;
    END;
  `);

  console.log('✓ KPI items table created');
  console.log('✓ Database initialization complete');
}

// Graceful shutdown
export function closeDatabase() {
  db.close();
  console.log('✓ Database connection closed');
}
