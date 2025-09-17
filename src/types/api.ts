// Core API types matching backend specification
export interface Project {
  Project_Names: string;
  Location: string;
}

export interface ProcessRequest {
  template_name: string;
  for_whom_proposal_is?: string;
  submitted_to?: string;
  date?: string;
  cost?: string;
  extra_points: string[];
  projects: Project[];
  projects_start_sno: number;
}

export interface ProcessSuccess {
  success: true;
  message: string;
  output_file: string;
  download_url: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  message: string;
}

export interface InfoResponse {
  app_name: string;
  description: string;
  version: string;
  service_type: string;
  endpoints: string[];
  features: string[];
}

export interface TemplatesResponse {
  templates: string[];
  count: number;
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface APIError {
  detail: string | ValidationError[];
}

export interface NormalizedError {
  status: number;
  message: string;
  validationErrors?: ValidationError[];
}