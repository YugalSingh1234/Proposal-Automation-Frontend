import React, { useState, useEffect } from 'react';
import { Server, Code, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { InfoResponse, HealthResponse } from '../types/api';
import { getInfo, getHealth } from '../api/endpoints';
import { useToast } from '../hooks/useToast';
import type { NormalizedError } from '../types/api';

export const Info: React.FC = () => {
  const [infoData, setInfoData] = useState<InfoResponse | null>(null);
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [healthLoading, setHealthLoading] = useState(false);
  const [infoError, setInfoError] = useState<string>('');
  const [healthError, setHealthError] = useState<string>('');
  
  const { addToast, ToastContainer } = useToast();

  useEffect(() => {
    loadInfo();
    loadHealth();
  }, []);

  const loadInfo = async () => {
    setInfoLoading(true);
    setInfoError('');
    
    try {
      const response = await getInfo();
      setInfoData(response);
    } catch (error) {
      const err = error as NormalizedError;
      setInfoError(err.message);
      
      addToast({
        type: 'error',
        title: 'Failed to load API info',
        message: err.message,
      });
    } finally {
      setInfoLoading(false);
    }
  };

  const loadHealth = async () => {
    setHealthLoading(true);
    setHealthError('');
    
    try {
      const response = await getHealth();
      setHealthData(response);
    } catch (error) {
      const err = error as NormalizedError;
      setHealthError(err.message);
      
      addToast({
        type: 'error',
        title: 'Failed to load health status',
        message: err.message,
      });
    } finally {
      setHealthLoading(false);
    }
  };

  const refreshData = () => {
    loadInfo();
    loadHealth();
  };

  if (infoLoading || healthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading API information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Information</h1>
          <p className="text-gray-600">Backend service details and health status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Health Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Server size={20} className="text-blue-600" />
                Health Status
              </h3>
              <button
                onClick={refreshData}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh status"
              >
                <Loader2 size={16} className={healthLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {healthError ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle size={20} className="text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">Service Unavailable</p>
                  <p className="text-sm text-red-600">{healthError}</p>
                </div>
              </div>
            ) : healthData ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 capitalize">{healthData.status}</p>
                  <p className="text-sm text-green-600">{healthData.service}</p>
                  {healthData.message && (
                    <p className="text-xs text-green-500 mt-1">{healthData.message}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            )}
          </div>

          {/* API Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Code size={20} className="text-blue-600" />
              Service Details
            </h3>

            {infoError ? (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {infoError}
              </div>
            ) : infoData ? (
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Application</dt>
                  <dd className="text-lg font-semibold text-gray-900">{infoData.app_name}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Version</dt>
                  <dd className="text-gray-900">{infoData.version}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Service Type</dt>
                  <dd className="text-gray-900">{infoData.service_type}</dd>
                </div>

                {infoData.description && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="text-gray-900 text-sm">{infoData.description}</dd>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            )}
          </div>

          {/* Features */}
          {infoData?.features && (
            <div className="bg-white rounded-lg shadow-sm border p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {infoData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="text-blue-800 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Endpoints */}
          {infoData?.endpoints && (
            <div className="bg-white rounded-lg shadow-sm border p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Endpoints</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {infoData.endpoints.map((endpoint, index) => (
                  <code
                    key={index}
                    className="text-xs bg-gray-100 px-3 py-2 rounded border font-mono text-gray-700"
                  >
                    {endpoint}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
};