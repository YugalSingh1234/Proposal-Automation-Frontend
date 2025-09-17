import React, { useState, useEffect } from 'react';
import { Send, RotateCcw, Download, Loader2 } from 'lucide-react';
import { TemplatePicker } from '../components/TemplatePicker';
import { ExtraPointsList } from '../components/ExtraPointsList';
import { ProjectsEditor } from '../components/ProjectsEditor';
import { JsonPreview } from '../components/JsonPreview';
import { ProcessRequest, Project, ProcessSuccess } from '../types/api';
import { getTemplates, processProposal, getDownloadUrl } from '../api/endpoints';
import { validateProcessRequest } from '../utils/validation';
import { saveFormData, loadFormData, clearFormData } from '../utils/storage';
import { useToast } from '../hooks/useToast';
import type { NormalizedError } from '../types/api';

const DEFAULT_FORM_DATA: ProcessRequest = {
  template_name: '',
  for_whom_proposal_is: '',
  submitted_to: '',
  date: '',
  cost: '',
  extra_points: [],
  projects: [],
  projects_start_sno: 12,
};

export const Dashboard: React.FC = () => {
  const [formData, setFormData] = useState<ProcessRequest>(DEFAULT_FORM_DATA);
  const [templates, setTemplates] = useState<string[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessSuccess | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const { addToast, ToastContainer } = useToast();

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
    loadSavedFormData();
  }, []);

  // Save form data whenever it changes (except result)
  useEffect(() => {
    if (formData !== DEFAULT_FORM_DATA) {
      saveFormData(formData);
    }
  }, [formData]);

  const loadTemplates = async () => {
    setTemplatesLoading(true);
    setTemplatesError('');
    
    try {
      const response = await getTemplates();
      setTemplates(response.templates);
      
      addToast({
        type: 'success',
        title: 'Templates loaded',
        message: `${response.count} templates available`,
      });
    } catch (error) {
      const err = error as NormalizedError;
      setTemplatesError(err.message);
      
      addToast({
        type: 'error',
        title: 'Failed to load templates',
        message: err.message,
      });
    } finally {
      setTemplatesLoading(false);
    }
  };

  const loadSavedFormData = () => {
    const savedData = loadFormData();
    if (savedData) {
      setFormData({ ...DEFAULT_FORM_DATA, ...savedData });
    }
  };

  const updateFormField = <K extends keyof ProcessRequest>(
    field: K,
    value: ProcessRequest[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM_DATA);
    setResult(null);
    setValidationErrors({});
    clearFormData();
    
    addToast({
      type: 'info',
      title: 'Form reset',
      message: 'All data cleared',
    });
  };

  const handleSubmit = async () => {
    // Validate form
    const validation = validateProcessRequest(formData, templates);
    setValidationErrors(validation.errors);
    
    if (!validation.isValid) {
      addToast({
        type: 'error',
        title: 'Validation failed',
        message: 'Please fix the errors and try again',
      });
      return;
    }

    setProcessing(true);
    
    try {
      const response = await processProposal(formData);
      setResult(response);
      
      addToast({
        type: 'success',
        title: 'Proposal processed successfully',
        message: response.message,
      });
    } catch (error) {
      const err = error as NormalizedError;
      
      // Handle validation errors from backend
      if (err.validationErrors) {
        const backendErrors: Record<string, string> = {};
        err.validationErrors.forEach(valError => {
          const fieldPath = valError.loc.join('.');
          backendErrors[fieldPath] = valError.msg;
        });
        setValidationErrors(backendErrors);
      }
      
      addToast({
        type: 'error',
        title: 'Processing failed',
        message: err.message,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.download_url) {
      const fullUrl = getDownloadUrl(result.download_url.split('/').pop() || '');
      window.open(fullUrl, '_blank');
    }
  };

  const isFormValid = () => {
    return formData.template_name.length > 0 && 
           formData.projects.every(p => p.Project_Names.trim() && p.Location.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Templates */}
          <div className="lg:col-span-1">
            <TemplatePicker
              templates={templates}
              selectedTemplate={formData.template_name}
              onTemplateSelect={(template) => updateFormField('template_name', template)}
              onRefresh={loadTemplates}
              loading={templatesLoading}
              error={templatesError}
            />
          </div>

          {/* Center Panel - Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Form</h3>
              
              {/* Basic Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    For Whom Proposal Is
                  </label>
                  <input
                    type="text"
                    value={formData.for_whom_proposal_is || ''}
                    onChange={(e) => updateFormField('for_whom_proposal_is', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Client or organization name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submitted To
                  </label>
                  <input
                    type="text"
                    value={formData.submitted_to || ''}
                    onChange={(e) => updateFormField('submitted_to', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Department or contact person"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => updateFormField('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost
                    </label>
                    <input
                      type="text"
                      value={formData.cost || ''}
                      onChange={(e) => updateFormField('cost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., $10,000"
                    />
                  </div>
                </div>
              </div>

              {/* Extra Points */}
              <ExtraPointsList
                points={formData.extra_points}
                onPointsChange={(points) => updateFormField('extra_points', points)}
              />

              {/* Projects */}
              <ProjectsEditor
                projects={formData.projects}
                onProjectsChange={(projects) => updateFormField('projects', projects)}
                startSno={formData.projects_start_sno}
                onStartSnoChange={(sno) => updateFormField('projects_start_sno', sno)}
                errors={validationErrors}
              />
            </div>
          </div>

          {/* Right Panel - Preview & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* JSON Preview */}
            <JsonPreview data={formData} />

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Actions</h4>
              
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || processing}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {processing ? 'Processing...' : 'Process Proposal'}
                </button>

                <button
                  onClick={handleReset}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  <RotateCcw size={16} />
                  Reset Form
                </button>

                {result && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-800 mb-2">Success!</h5>
                    <p className="text-sm text-green-700 mb-3">{result.message}</p>
                    <p className="text-xs text-green-600 mb-3">
                      Output file: {result.output_file}
                    </p>
                    <button
                      onClick={handleDownload}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download size={16} />
                      Download Proposal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
};