'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface HealthParameter {
  name: string;
  value: string;
  unit?: string;
  normalRange?: string;
  status?: 'normal' | 'high' | 'low';
}

interface SavedReport {
  _id: string;
  fileName: string;
  fileSize: number;
  healthParameters: HealthParameter[];
  createdAt: string;
  parametersCount: number;
}

interface ReportHistoryProps {
  userId: string;
  onReportSelect: (parameters: HealthParameter[]) => void;
  refreshTrigger?: number; // Optional prop to trigger refresh from parent
}

export default function ReportHistory({ userId, onReportSelect, refreshTrigger }: ReportHistoryProps) {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchReports = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/save-report', {
        headers: {
          'x-user-id': userId, 
        },
      });
      const result = await response.json();
      
      if (result.success) {
        setReports(result.reports);
        // console.log(`📊 Loaded ${result.reports.length} reports from history`);
      } else {
        setError(result.error || 'Failed to load reports');
      }
    } catch (err) {
      // console.error('Error fetching reports:', err);
      setError('Failed to load report history');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Refresh when parent triggers refresh (after saving new report)
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchReports();
    }
  }, [refreshTrigger, fetchReports]);

  const getStatusCounts = (parameters: HealthParameter[]) => {
    const counts = { normal: 0, abnormal: 0 };
    parameters.forEach(param => {
      if (param.status === 'normal') {
        counts.normal++;
      } else if (param.status === 'high' || param.status === 'low') {
        counts.abnormal++;
      }
    });
    return counts;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading && reports.length === 0) {
    return (
      <div className="mt-12">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your reports...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="text-center text-red-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
            <button 
              onClick={fetchReports}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="mt-12">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Reports Yet</h3>
            <p className="text-gray-500">Upload and analyze your first lab report to see it here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <FileText className="h-6 w-6" />
            <span>Your Report History</span>
          </h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {reports.length} report{reports.length !== 1 ? 's' : ''}
            </span>
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => {
            const statusCounts = getStatusCounts(report.healthParameters);
            
            return (
              <div
                key={report._id}
                onClick={() => onReportSelect(report.healthParameters)}
                className="group p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {report.fileName}
                  </h4>
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Parameters:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {report.parametersCount}
                    </span>
                  </div>
                  
                  {report.parametersCount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-green-600 dark:text-green-400">{statusCounts.normal}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          <span className="text-red-600 dark:text-red-400">{statusCounts.abnormal}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  <span>{formatFileSize(report.fileSize)}</span>
                </div>
                
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors opacity-0 group-hover:opacity-100">
                  Click to view results →
                </div>
              </div>
            );
          })}
        </div>
        
        {reports.length >= 50 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing your most recent 50 reports
          </div>
        )}
      </div>
    </div>
  );
}
