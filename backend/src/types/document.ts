// Document data model interfaces
export interface Document {
  id: number;
  filename: string;
  originalFilename: string;
  pillar: 'pillar-1' | 'pillar-2' | 'pillar-3' | 'pillar-4' | 'kpis' | 'capa';
  category: 'policies' | 'procedures' | 'forms' | 'evidence' | null;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  filePath: string;
}

// Database insert interface
export interface DocumentInsert {
  filename: string;
  originalFilename: string;
  pillar: string;
  category: string | null;
  fileType: string;
  fileSize: number;
  filePath: string;
}
