import axios from 'axios';
import type { CAPA, CAPACreateRequest, CAPAUpdateRequest } from '../types/capa';
import { config } from '../config';

const API_BASE = config.apiBaseUrl;

export const capaService = {
  getAll: async (): Promise<CAPA[]> => {
    const response = await axios.get<CAPA[]>(`${API_BASE}/capas`);
    return response.data;
  },

  getByStatus: async (status: string): Promise<CAPA[]> => {
    const response = await axios.get<CAPA[]>(`${API_BASE}/capas/status/${status}`);
    return response.data;
  },

  getById: async (id: number): Promise<CAPA> => {
    const response = await axios.get<CAPA>(`${API_BASE}/capas/${id}`);
    return response.data;
  },

  create: async (data: CAPACreateRequest): Promise<CAPA> => {
    const response = await axios.post<CAPA>(`${API_BASE}/capas`, data);
    return response.data;
  },

  update: async (id: number, data: CAPAUpdateRequest): Promise<CAPA> => {
    const response = await axios.put<CAPA>(`${API_BASE}/capas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/capas/${id}`);
  },
};
