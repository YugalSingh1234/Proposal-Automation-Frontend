import React from 'react';
import { Code, Copy, Check } from 'lucide-react';
import { ProcessRequest } from '../types/api';

interface JsonPreviewProps {
  data: ProcessRequest;
  className?: string;
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ data, className = '' }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-gray-600" />
          <h4 className="text-sm font-medium text-gray-700">Request Payload</h4>
        </div>
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          title="Copy JSON"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      
      <div className="p-4">
        <pre className="text-xs bg-gray-50 p-3 rounded border overflow-x-auto max-h-64 overflow-y-auto">
          <code className="text-gray-800">
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      </div>
    </div>
  );
};