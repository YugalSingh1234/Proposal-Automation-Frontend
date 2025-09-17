import { ProcessRequest, Project } from '../types/api';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateProcessRequest = (
  data: ProcessRequest, 
  availableTemplates: string[]
): ValidationResult => {
  const errors: Record<string, string> = {};

  // Template name validation
  if (!data.template_name) {
    errors.template_name = 'Template selection is required';
  } else if (!data.template_name.endsWith('.docx')) {
    errors.template_name = 'Template must be a .docx file';
  } else if (!availableTemplates.includes(data.template_name)) {
    errors.template_name = 'Selected template is not available';
  }

  // Projects validation
  data.projects.forEach((project, index) => {
    if (!project.Project_Names.trim()) {
      errors[`projects.${index}.Project_Names`] = 'Project name is required';
    }
    if (!project.Location.trim()) {
      errors[`projects.${index}.Location`] = 'Project location is required';
    }
  });

  // Projects start sno validation
  if (data.projects_start_sno < 1) {
    errors.projects_start_sno = 'Starting S. No. must be at least 1';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProject = (project: Project): boolean => {
  return project.Project_Names.trim().length > 0 && project.Location.trim().length > 0;
};