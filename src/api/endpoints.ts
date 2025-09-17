import { apiClient } from './http';
import { 
  HealthResponse, 
  InfoResponse, 
  TemplatesResponse, 
  ProcessRequest, 
  ProcessSuccess 
} from '../types/api';

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get('/health');
  return response.data;
};

export const getInfo = async (): Promise<InfoResponse> => {
  const response = await apiClient.get('/api/info');
  return response.data;
};

export const getTemplates = async (): Promise<TemplatesResponse> => {
  const response = await apiClient.get('/api/templates');
  return response.data;
};

export const processProposal = async (payload: ProcessRequest): Promise<ProcessSuccess> => {
  const response = await apiClient.post('/api/process-proposal', payload);
  return response.data;
};

export const getDownloadUrl = (filename: string): string => {
  const baseURL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
  return `${baseURL}/api/download/${filename}`;
};