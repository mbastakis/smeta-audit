import axios from 'axios';
import type { Document, DocumentCounts } from '../types/document';
import { config } from '../config';

const API_BASE = config.apiBaseUrl;

export const documentService = {
  getCounts: async (): Promise<DocumentCounts> => {
    const response = await axios.get<DocumentCounts>(`${API_BASE}/documents/counts`);
    return response.data;
  },

  getDocumentsByPillarAndCategory: async (pillar: string, category: string): Promise<Document[]> => {
    const response = await axios.get<Document[]>(`${API_BASE}/documents/pillar/${pillar}/category/${category}`);
    return response.data;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/documents/${id}`);
  },

  searchDocuments: async (query: string): Promise<{ query: string; count: number; results: Document[] }> => {
    const response = await axios.get(`${API_BASE}/search`, {
      params: { q: query }
    });
    return response.data;
  },

  uploadDocument: async (
    file: File,
    pillar: string,
    category?: string,
    displayName?: string,
    onProgress?: (percentage: number) => void
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pillar', pillar);
    if (category) {
      formData.append('category', category);
    }
    if (displayName) {
      formData.append('displayName', displayName);
    }

    const response = await axios.post<Document>(`${API_BASE}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      },
    });

    return response.data;
  },
};
