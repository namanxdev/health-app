'use client';

import { useState, useEffect } from 'react';
import { useUser, SignOutButton, RedirectToSignIn } from '@clerk/nextjs';
import { 
  FileText, 
  Activity, 
  Upload, 
  Zap, 
  Brain, 
  Shield, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Sparkles,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import FileUpload from './components/FileInput';
import HealthParametersTable from './components/HealthParameters';

interface HealthParameter {
  name: string;
  value: string;
  unit?: string;
  normalRange?: string;
  status?: 'normal' | 'high' | 'low';
}

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [healthParameters, setHealthParameters] = useState<HealthParameter[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDataExtracted = (data: HealthParameter[]) => {
    console.log('📊 Received health parameters in page.tsx:', data);
    setHealthParameters(data);
  };

  const getStatusCounts = () => {
    const counts = { normal: 0, high: 0, low: 0, unknown: 0 };
    healthParameters.forEach(param => {
      if (param.status) {
        counts[param.status]++;
      } else {
        counts.unknown++;
      }
    });
    return counts;
  };

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header with User Info and Sign Out */}
      <div className="relative z-50 flex justify-between items-center p-6 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Health Analyzer</h2>
            <p className="text-xs text-gray-500">AI-Powered Lab Report Analysis</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* User Info Card */}
          <div className="flex items-center space-x-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 shadow-sm">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          
          {/* Sign Out Button */}
          <SignOutButton>
            <button className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition-all border border-red-200/50">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </SignOutButton>
        </div>
      </div>

      <main className="relative z-10 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <Activity className="h-8 w-8 text-white animate-pulse" />
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4 leading-tight">
              Welcome back, {user.firstName}! 👋
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ready to analyze your health reports? Upload a lab report to get started.
            </p>

            {/* Authentication Status Indicator */}
            <div className="mt-6 inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Authenticated & Ready</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Upload Lab Report
                  </h2>
                </div>
                <FileUpload
                  onDataExtracted={handleDataExtracted}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </div>

              {/* Stats Cards */}
              {healthParameters.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Normal</p>
                        <p className="text-2xl font-bold">{statusCounts.normal}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm">Abnormal</p>
                        <p className="text-2xl font-bold">{statusCounts.high + statusCounts.low}</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Health Parameters
                    </h2>
                  </div>
                  
                  {healthParameters.length > 0 && (
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full px-4 py-2">
                      <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                        {healthParameters.length} parameter{healthParameters.length !== 1 ? 's' : ''} found
                      </span>
                    </div>
                  )}
                </div>
                
                <HealthParametersTable parameters={healthParameters} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}