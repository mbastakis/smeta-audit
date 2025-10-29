export interface KPIItem {
  id: number;
  title: string;
  category: 'statistics' | 'research' | 'kpis' | 'org-chart' | 'business-plan';
  fileType: 'html-package' | 'pdf' | 'xlsx' | 'docx' | 'jpg' | 'png';
  uploadDate: string;
  folderPath: string;
  hasIndexHtml: boolean;
}

export interface KPIUploadRequest {
  file: File;
  title: string;
  category: KPIItem['category'];
  fileType: KPIItem['fileType'];
}

export interface KPIItemRow {
  id: number;
  title: string;
  category: string;
  file_type: string;
  upload_date: string;
  folder_path: string;
  has_index_html: number;
}
