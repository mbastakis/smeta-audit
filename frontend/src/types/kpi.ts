export type KPICategoryType = 'statistics' | 'research' | 'kpis' | 'org-chart' | 'business-plan';

export type KPIFileType = 'html-package' | 'pdf' | 'xlsx' | 'docx' | 'jpg' | 'png';

export interface KPIItem {
  id: number;
  title: string;
  category: KPICategoryType;
  fileType: KPIFileType;
  uploadDate: string;
  folderPath: string;
  hasIndexHtml: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KPIUploadRequest {
  file: File;
  title: string;
  category: KPICategoryType;
  fileType: KPIFileType;
}

export interface KPICategoryInfo {
  id: KPICategoryType;
  title: string;
  description: string;
  icon: string;
  color: string;
}
