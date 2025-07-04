'use client';

import { useState } from 'react';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { 
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataExtracted = (data: HealthParameter[]) => {
    // console.log('📊 Received health parameters in page.tsx:', data);
    setHealthParameters(data);
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Requested Radial Gradient Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-900 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#0f172a_40%,#4c1d95_100%)]"></div>
      
      {/* Beautiful Floating Orbs with Reduced Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs with subtle animation */}
        <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-gradient-to-br from-blue-300/40 via-indigo-400/30 to-purple-500/25 dark:from-blue-600/30 dark:via-indigo-700/25 dark:to-purple-800/20 rounded-full blur-3xl animate-float opacity-50"></div>
        <div className="absolute -bottom-48 -left-48 w-[450px] h-[450px] bg-gradient-to-br from-purple-300/40 via-pink-400/30 to-rose-500/25 dark:from-purple-600/30 dark:via-pink-700/25 dark:to-rose-800/20 rounded-full blur-3xl animate-float-delayed opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-cyan-300/40 via-teal-400/30 to-emerald-500/25 dark:from-cyan-600/30 dark:via-teal-700/25 dark:to-emerald-800/20 rounded-full blur-3xl animate-pulse-slow opacity-40"></div>
        
        {/* Medium floating elements */}
        <div className="absolute top-20 right-1/4 w-48 h-48 bg-gradient-to-br from-yellow-300/50 via-orange-400/40 to-red-500/30 dark:from-yellow-600/40 dark:via-orange-700/30 dark:to-red-800/25 rounded-full blur-2xl animate-bounce-gentle opacity-60"></div>
        <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-gradient-to-br from-green-300/50 via-teal-400/40 to-blue-500/30 dark:from-green-600/40 dark:via-teal-700/30 dark:to-blue-800/25 rounded-full blur-xl animate-float-reverse opacity-60"></div>
        
        {/* Small accent orbs */}
        <div className="absolute top-1/4 left-1/6 w-24 h-24 bg-gradient-to-br from-violet-400/60 to-purple-600/50 dark:from-violet-600/50 dark:to-purple-800/40 rounded-full blur-lg animate-pulse opacity-70"></div>
        <div className="absolute bottom-1/4 right-1/6 w-32 h-32 bg-gradient-to-br from-pink-400/60 to-rose-600/50 dark:from-pink-600/50 dark:to-rose-800/40 rounded-full blur-lg animate-float opacity-70"></div>
      </div>

      {/* Ultra-Beautiful Enhanced Header */}
      <div className="relative z-50 flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 bg-gradient-to-r from-white/90 via-purple-50/80 to-pink-50/90 dark:from-slate-900/90 dark:via-purple-900/80 dark:to-pink-900/90 backdrop-blur-xl border-b border-purple-300/60 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:bg-gradient-to-r hover:from-white/95 hover:via-purple-50/85 hover:to-pink-50/95 dark:hover:from-slate-900/95 dark:hover:via-purple-900/85 dark:hover:to-pink-900/95">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl blur opacity-60 group-hover:opacity-90 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-500">
              <Activity className="h-6 w-6 text-white group-hover:animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-text">
              HealthAnalyzer Pro
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              ✨ AI-Powered Professional Analysis
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
          {isSignedIn ? (
            <>
              {/* Ultra-Beautiful User Card */}
              <div className="group flex items-center space-x-3 bg-gradient-to-r from-white/95 via-blue-50/85 to-indigo-50/95 dark:from-slate-800/95 dark:via-blue-900/85 dark:to-indigo-900/95 backdrop-blur-xl rounded-2xl px-6 py-4 border border-blue-300/70 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-110 hover:bg-gradient-to-r hover:from-blue-50/95 hover:via-indigo-50/85 hover:to-purple-50/95 dark:hover:from-blue-900/95 dark:hover:via-indigo-900/85 dark:hover:to-purple-900/95">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-90 transition-opacity duration-500 animate-pulse"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-2xl group-hover:rotate-12 group-hover:scale-125 transition-all duration-500">
                    <UserIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
              
              {/* Ultra-Beautiful Sign Out Button */}
              <SignOutButton>
                <button className="group flex items-center space-x-2 bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 hover:from-red-100 hover:via-rose-100 hover:to-pink-100 dark:from-red-900/40 dark:via-rose-900/40 dark:to-pink-900/40 dark:hover:from-red-900/60 dark:hover:via-rose-900/60 dark:hover:to-pink-900/60 backdrop-blur-xl rounded-2xl px-6 py-4 text-sm font-bold text-red-600 dark:text-red-400 transition-all duration-500 border border-red-300/50 shadow-2xl hover:shadow-3xl hover:scale-110 hover:bg-gradient-to-r hover:from-red-100 hover:via-rose-100 hover:to-pink-100 dark:hover:from-red-800/70 dark:hover:via-rose-800/70 dark:hover:to-pink-800/70">
                  <LogOut className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Sign Out</span>
                </button>
              </SignOutButton>
            </>
          ) : (
            /* Enhanced Beautiful Auth Buttons */
            <div className="flex items-center space-x-3">
              <SignInButton mode="modal">
                <button className="group flex items-center space-x-2 bg-gradient-to-r from-gray-100 via-slate-100 to-gray-100 hover:from-gray-200 hover:via-slate-200 hover:to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 dark:hover:from-slate-600 dark:hover:via-slate-500 dark:hover:to-slate-600 backdrop-blur-xl rounded-2xl px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 transition-all duration-300 border border-gray-300/40 shadow-lg hover:shadow-xl hover:scale-105">
                  <UserIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
              
              <SignInButton mode="modal">
                <button className="group flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white backdrop-blur-xl rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border border-white/20">
                  <UserPlus className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Sign Up Free</span>
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>

      <main className="relative z-10 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Beautiful Enhanced Welcome Section */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="relative inline-flex items-center justify-center p-4 mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 animate-pulse-slow transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-4 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Activity className="h-10 w-10 text-white animate-bounce" />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black mb-4 lg:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                {isSignedIn ? `Welcome, ${user?.firstName}! ` : 'Beautiful Health Analysis'}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
              {isSignedIn 
                ? "Ready to transform your health data into beautiful insights? Upload your lab reports and watch the magic happen! 🎯✨"
                : "Experience the most beautiful and intelligent health analysis platform. Transform your lab reports into stunning, actionable insights! 🚀💫"
              }
            </p>

            {/* Beautiful Enhanced Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10 sm:mt-12">
              <div className="group flex items-center space-x-3 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-purple-50/90 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 backdrop-blur-xl rounded-2xl px-6 py-4 border border-blue-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                    <Brain className="h-5 w-5 text-white group-hover:animate-pulse" />
                  </div>
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                  AI-Powered Analysis
                </span>
              </div>
              
              <div className="group flex items-center space-x-3 bg-gradient-to-r from-yellow-50/90 via-orange-50/80 to-amber-50/90 dark:from-yellow-900/40 dark:via-orange-900/30 dark:to-amber-900/40 backdrop-blur-xl rounded-2xl px-6 py-4 border border-yellow-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative p-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl">
                    <Zap className="h-5 w-5 text-white group-hover:animate-bounce" />
                  </div>
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-yellow-700 to-orange-700 dark:from-yellow-300 dark:to-orange-300 bg-clip-text text-transparent">
                  Lightning Fast Results
                </span>
              </div>
              
              <div className="group flex items-center space-x-3 bg-gradient-to-r from-green-50/90 via-emerald-50/80 to-teal-50/90 dark:from-green-900/40 dark:via-emerald-900/30 dark:to-teal-900/40 backdrop-blur-xl rounded-2xl px-6 py-4 border border-green-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                    <Shield className="h-5 w-5 text-white group-hover:animate-pulse" />
                  </div>
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">
                  {isSignedIn ? 'Ultra Secure Storage' : 'Privacy-First Design'}
                </span>
              </div>
            </div>

            {/* Beautiful Enhanced CTA */}
            {!isSignedIn && (
              <div className="mt-10 group">
                <div className="relative p-8 bg-gradient-to-br from-blue-50/90 via-indigo-50/80 to-purple-50/90 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/30 backdrop-blur-2xl rounded-3xl border border-blue-200/60 max-w-lg mx-auto shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-50 animate-pulse"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-white group-hover:animate-spin" />
                        </div>
                      </div>
                      <h3 className="text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Unlock Premium Features! 🎯
                      </h3>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 mb-6 font-medium">
                      Join thousands of users who trust us with their health data. Get advanced insights, 
                      trend analysis, and secure cloud storage - all completely free! 🔥
                    </p>
                    <SignInButton mode="modal">
                      <button className="group w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border border-white/20">
                        <span className="flex items-center justify-center space-x-2">
                          <span>Start Your Journey Free</span>
                          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                            <span className="text-xs">✨</span>
                          </div>
                        </span>
                      </button>
                    </SignInButton>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Beautiful Enhanced Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
            {/* Beautiful Enhanced Upload Section */}
            <div className="space-y-8">
              <div className="group relative bg-gradient-to-br from-white/90 via-blue-50/80 to-indigo-50/90 dark:from-slate-800/90 dark:via-blue-900/80 dark:to-indigo-900/90 backdrop-blur-2xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-blue-200/60 hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] overflow-hidden">
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/3 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div className="flex items-center space-x-4 mb-6 sm:mb-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                        <div className="relative p-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl group-hover:rotate-6 transition-transform duration-500">
                          <Upload className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          Upload Lab Report
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          PDF, PNG, JPG supported • Drag & drop magic ✨
                        </p>
                      </div>
                    </div>
                    {isProcessing && (
                      <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 backdrop-blur-xl rounded-2xl px-4 py-3 border border-blue-200/50 shadow-lg">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-300 border-t-blue-600 shadow-lg"></div>
                          <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-30"></div>
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent block">
                            ✨ Processing Magic...
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            AI is analyzing your data
                          </span>
                        </div>
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
              </div>

              {/* Beautiful Enhanced Stats Cards */}
              {healthParameters.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group relative bg-gradient-to-br from-green-50/95 via-emerald-50/90 to-teal-50/95 dark:from-green-900/40 dark:via-emerald-900/30 dark:to-teal-900/40 backdrop-blur-xl rounded-2xl p-6 border border-green-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-emerald-400/5 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-green-700 dark:text-green-300 text-sm font-bold uppercase tracking-wider mb-1">
                            ✅ Perfect Range
                          </p>
                          <p className="text-3xl font-black bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">
                            {statusCounts.normal}
                          </p>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur group-hover:bg-green-400/50 transition-colors duration-300"></div>
                          <div className="relative p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                            <CheckCircle className="h-7 w-7 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-green-200/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full group-hover:animate-pulse transition-all duration-300"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group relative bg-gradient-to-br from-red-50/95 via-rose-50/90 to-pink-50/95 dark:from-red-900/40 dark:via-rose-900/30 dark:to-pink-900/40 backdrop-blur-xl rounded-2xl p-6 border border-red-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-rose-400/5 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-red-700 dark:text-red-300 text-sm font-bold uppercase tracking-wider mb-1">
                            ⚠️ Needs Attention
                          </p>
                          <p className="text-3xl font-black bg-gradient-to-r from-red-700 to-rose-700 dark:from-red-300 dark:to-rose-300 bg-clip-text text-transparent">
                            {statusCounts.high + statusCounts.low}
                          </p>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-red-500/30 rounded-2xl blur group-hover:bg-red-400/50 transition-colors duration-300"></div>
                          <div className="relative p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                            <AlertCircle className="h-7 w-7 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-red-200/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-400 to-rose-500 rounded-full group-hover:animate-pulse transition-all duration-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Results Section */}
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200/50 dark:border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <div className="p-2.5 bg-indigo-600 rounded-xl shadow-sm">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                        Analysis Results
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI-extracted parameters
                      </p>
                    </div>
                  </div>
                  
                  {healthParameters.length > 0 && (
                    <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl px-3 py-2">
                      <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                        {healthParameters.length} parameters found
                      </span>
                    </div>
                  )}
                </div>
                
                <HealthParametersTable parameters={healthParameters} />
              </div>
            </div>
          </div>

          {/* Professional Medical Disclaimer */}
          {healthParameters.length > 0 && (
            <div className="mt-12 lg:mt-16">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 lg:p-8 border border-amber-200/50 dark:border-amber-700/50 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-amber-600 rounded-xl shadow-sm">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">
                      Important Medical Disclaimer
                    </h3>
                    
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      This AI-powered analysis is for <strong>informational purposes only</strong> and should 
                      <strong> never replace professional medical advice</strong>. Always consult your healthcare 
                      provider for proper interpretation of lab results. Our AI extraction may contain errors - 
                      please verify against your original report.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 pt-2">
                      <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Privacy Protected</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{isSignedIn ? 'Securely Stored' : 'Not Stored'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>AI-Powered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Professional Report History */}
          {isSignedIn && user && (
            <div className="mt-12 lg:mt-16">
              <ReportHistory 
                userId={user.id} 
                onReportSelect={handleReportSelect}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}
        </div>
      </main>

      {/* Professional Custom Styles */}
      <style jsx>{`
        .blur-3xl {
          filter: blur(64px);
        }
        
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .text-3xl {
            font-size: 1.75rem;
            line-height: 2.25rem;
          }
          
          .text-4xl {
            font-size: 2rem;
            line-height: 2.5rem;
          }
          
          .text-5xl {
            font-size: 2.5rem;
            line-height: 3rem;
          }
        }
      `}</style>
    </div>
  );
}