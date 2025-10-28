export interface Document {
  id: number;
  filename: string;
  originalFilename: string;
  pillar: 'pillar-1' | 'pillar-2' | 'pillar-3' | 'pillar-4' | 'kpis' | 'capa';
  category: 'policies' | 'procedures' | 'forms' | 'evidence' | null;
  fileType: string;
  fileSize: number;
  uploadDate: string; // ISO 8601 format
  filePath: string;
}

export interface DocumentCounts {
  [pillar: string]: {
    [category: string]: number;
    total: number;
  };
}
