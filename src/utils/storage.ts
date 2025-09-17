import { ProcessRequest } from '../types/api';

const STORAGE_KEY = 'proposal_form_data';

export const saveFormData = (data: Partial<ProcessRequest>): void => {
  try {
    // Don't save download-related data
    const { ...saveData } = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  } catch (error) {
    console.warn('Failed to save form data to localStorage:', error);
  }
};

export const loadFormData = (): Partial<ProcessRequest> | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load form data from localStorage:', error);
    return null;
  }
};

export const clearFormData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear form data from localStorage:', error);
  }
};