import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'healthy' | 'unhealthy' | 'loading';
  service?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, service, className = '' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unhealthy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'healthy':
        return <Activity size={14} className="text-green-600" />;
      case 'unhealthy':
        return <AlertCircle size={14} className="text-red-600" />;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />;
    }
  };

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium
      ${getStatusColor()} ${className}
    `}>
      {getIcon()}
      <span className="capitalize">{status}</span>
      {service && <span className="text-xs opacity-75">({service})</span>}
    </div>
  );
};