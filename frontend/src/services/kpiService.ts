import axios from 'axios';
import { KPIItem, KPIUploadRequest, KPICategoryType } from '../types/kpi';

const API_BASE = 'http://localhost:5001/api/kpis';

export const kpiService = {
  /**
   * Get all KPI items across all categories
   */
  async getAll(): Promise<KPIItem[]> {
    const response = await axios.get<{ items: KPIItem[] }>(API_BASE);
    return response.data.items;
  },

  /**
   * Get KPI items for a specific category
   */
  async getByCategory(category: KPICategoryType): Promise<KPIItem[]> {
    const response = await axios.get<{ items: KPIItem[] }>(`${API_BASE}/category/${category}`);
    return response.data.items;
  },

  /**
   * Upload a KPI item (single file or HTML package)
   */
  async upload(request: KPIUploadRequest, onProgress?: (percentage: number) => void): Promise<KPIItem> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('title', request.title);
    formData.append('category', request.category);
    formData.append('fileType', request.fileType);

    const response = await axios.post<{ item: KPIItem }>(
      `${API_BASE}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentage);
          }
        },
      }
    );

    return response.data.item;
  },

  /**
   * Delete a KPI item
   */
  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`);
  },

  /**
   * Get view URL for a KPI item (HTML package or single file)
   */
  getViewUrl(id: number): string {
    return `${API_BASE}/${id}/view`;
  },

  /**
   * Get download URL for a KPI item
   */
  getDownloadUrl(id: number): string {
    return `${API_BASE}/${id}/download`;
  },

  /**
   * Open KPI item in new window (for HTML packages) or download (for files)
   */
  openItem(item: KPIItem): void {
    if (item.hasIndexHtml) {
      // Open HTML package in new window
      window.open(this.getViewUrl(item.id), '_blank');
    } else {
      // Trigger download for single files
      window.open(this.getDownloadUrl(item.id), '_blank');
    }
  },
};
