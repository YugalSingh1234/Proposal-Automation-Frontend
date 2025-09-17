import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileCheck, Home, Info } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { HealthResponse } from '../types/api';

interface HeaderProps {
  healthData?: HealthResponse;
  healthLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ healthData, healthLoading }) => {
  const location = useLocation();
  
  const getHealthStatus = (): 'healthy' | 'unhealthy' | 'loading' => {
    if (healthLoading) return 'loading';
    return healthData?.status === 'healthy' ? 'healthy' : 'unhealthy';
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/info', label: 'Info', icon: Info },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileCheck size={24} className="text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Proposal Automation
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`
                  inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${location.pathname === path
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Health Status */}
          <div className="flex items-center gap-4">
            <StatusBadge 
              status={getHealthStatus()}
              service={healthData?.service}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t py-2 flex space-x-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === path
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};