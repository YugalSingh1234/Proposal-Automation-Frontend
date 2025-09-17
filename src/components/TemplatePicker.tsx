import React from 'react';
import { RefreshCw, FileText } from 'lucide-react';

interface TemplatePickerProps {
  templates: string[];
  selectedTemplate: string;
  onTemplateSelect: (template: string) => void;
  onRefresh: () => void;
  loading: boolean;
  error?: string;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onRefresh,
  loading,
  error,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh templates"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error ? (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="template-select" className="block text-sm font-medium text-gray-700">
            Select Template *
          </label>
          <select
            id="template-select"
            value={selectedTemplate}
            onChange={(e) => onTemplateSelect(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Choose a template...</option>
            {templates.map((template) => (
              <option key={template} value={template}>
                {template}
              </option>
            ))}
          </select>
          
          {templates.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {templates.length} template{templates.length !== 1 ? 's' : ''} available
            </p>
          )}
        </div>
      )}
    </div>
  );
};