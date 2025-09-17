import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { APIError, NormalizedError } from '../types/api';

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const baseURL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
  
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Ensure JSON headers are set
      if (config.data && typeof config.data === 'object') {
        config.headers['Content-Type'] = 'application/json';
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error normalization
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<APIError>) => {
      const normalizedError: NormalizedError = {
        status: error.response?.status || 0,
        message: 'Network error occurred',
      };

      if (error.response?.data) {
        const { detail } = error.response.data;
        
        if (typeof detail === 'string') {
          normalizedError.message = detail;
        } else if (Array.isArray(detail)) {
          // Handle 422 validation errors
          normalizedError.validationErrors = detail;
          normalizedError.message = 'Validation errors occurred';
        }
      } else if (error.message) {
        normalizedError.message = error.message;
      }

      return Promise.reject(normalizedError);
    }
  );

  return client;
};

export const apiClient = createApiClient();