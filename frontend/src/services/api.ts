import axios from 'axios';
import { config } from '../config';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export const healthCheck = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/health');
  return response.data;
};

export default apiClient;
