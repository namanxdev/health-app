'use client';

import { useState } from 'react';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
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
  User as UserIcon,
  UserPlus
} from 'lucide-react';
import FileUpload from './components/FileInput';
import HealthParametersTable from './components/HealthParameters';
import ReportHistory from './components/ReportHistory';

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
  const [refreshReports, setRefreshReports] = useState(0); // Trigger to refresh report history
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataExtracted = (data: HealthParameter[]) => {
    console.log('📊 Received health parameters in page.tsx:', data);
    setHealthParameters(data);
    
    // Trigger report history refresh if user is signed in
    if (isSignedIn) {
      setRefreshReports(prev => prev + 1);
    }
  };

  const handleReportSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleReportSelect = (parameters: HealthParameter[]) => {
    setHealthParameters(parameters);
    // Scroll to results
    const resultsSection = document.getElementById('results-section');
    resultsSection?.scrollIntoView({ behavior: 'smooth' });
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

  // Show loading only for a brief moment
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with Auth Options */}
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
          {isSignedIn ? (
            <>
              {/* User Info Card */}
              <div className="flex items-center space-x-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {user?.primaryEmailAddress?.emailAddress}
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
            </>
          ) : (
            /* Sign In/Up Buttons for Non-Authenticated Users */
            <div className="flex items-center space-x-3">
              <SignInButton mode="modal">
                <button className="flex items-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 transition-all border border-blue-200/50">
                  <UserIcon className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
              
              <SignInButton mode="modal">
                <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-4 py-2 text-sm font-medium transition-all shadow-sm">
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </button>
              </SignInButton>
            </div>
          )}
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
              {isSignedIn ? `Welcome back, ${user?.firstName}! 👋` : 'Health Report Analyzer 🏥'}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {isSignedIn 
                ? "Ready to analyze your health reports? Upload a lab report to get started."
                : "Transform your lab reports into actionable insights using AI-powered OCR technology. No account required!"
              }
            </p>

            {/* Status Pills */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Brain className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Instant Results</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{isSignedIn ? 'Secure & Private' : 'No Account Needed'}</span>
              </div>
            </div>

            {/* Optional Sign Up Prompt for Non-Authenticated Users */}
            {!isSignedIn && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 max-w-md mx-auto">
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  💡 <strong>Pro Tip:</strong> Sign up to save your analysis history!
                </p>
                <SignInButton mode="modal">
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    Create free account →
                  </button>
                </SignInButton>
              </div>
            )}
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
                  {isProcessing && (
                    <div className="flex items-center space-x-2 ml-auto">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-200 border-t-blue-600"></div>
                        <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping"></div>
                      </div>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 animate-pulse">
                        Processing...
                      </span>
                    </div>
                  )}
                </div>
                <FileUpload
                  onDataExtracted={handleDataExtracted}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                  onReportSaved={handleReportSaved}
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

          {/* Enhanced Footer Notice */}
          {healthParameters.length > 0 && (
            <div className="mt-12">
              <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                <div className="absolute top-4 right-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex-shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                      <span>Medical Disclaimer</span>
                      <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                      <span className="text-sm font-normal text-amber-600 dark:text-amber-400">Important</span>
                    </h3>
                    
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      This analysis is for <strong>informational purposes only</strong> and should not replace professional medical advice. 
                      Please consult your healthcare provider for proper interpretation of your lab results. The AI-powered extraction 
                      may contain errors and should be verified against your original report.
                    </p>
                    
                    <div className="flex items-center space-x-4 pt-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Privacy Protected</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>{isSignedIn ? 'Data Saved Securely' : 'No Data Stored (unless you sign up)'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Report History - Only for Authenticated Users */}
          {isSignedIn && user && (
            <ReportHistory 
              userId={user.id} 
              onReportSelect={handleReportSelect}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>
      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
}