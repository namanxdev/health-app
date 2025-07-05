'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Database } from "lucide-react";

interface HealthParameter {
  name: string;
  value: string;
  unit?: string;
  normalRange?: string;
  status?: 'normal' | 'high' | 'low';
}

interface HealthParametersTableProps {
  parameters: HealthParameter[];
}

export default function HealthParametersTable({ parameters }: HealthParametersTableProps) {
  // Add debugging
  // console.log('🔍 HealthParametersTable received parameters:', parameters);
  // console.log('📊 Parameters length:', parameters.length);

  const getStatusBadge = (status?: 'normal' | 'high' | 'low') => {
    switch (status) {
      case 'normal':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200">
            ✅ Normal
          </Badge>
        );
      case 'high':
        return <Badge variant="destructive" className="border-red-200">⬆️ High</Badge>;
      case 'low':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200">
            ⬇️ Low
          </Badge>
        );
      default:
        return <Badge variant="outline" className="border-gray-300">❓ Unknown</Badge>;
    }
  };

  if (parameters.length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Database className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            No Health Parameters Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Upload a lab report to extract and analyze health data. Make sure your report contains clear parameter names and values.
          </p>
        </div>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Supports PDF & Images</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Debug Info - Remove this in production */}
      {/* <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          🔍 Debug: Found {parameters.length} parameters
        </p>
        <details className="mt-2">
          <summary className="text-blue-600 dark:text-blue-400 cursor-pointer text-xs">
            Show raw data
          </summary>
          <pre className="mt-2 text-xs text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/40 p-2 rounded overflow-auto">
            {JSON.stringify(parameters, null, 2)}
          </pre>
        </details>
      </div> */}

      <div className="rounded-lg border bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
        <Table>
          <TableCaption className="text-gray-600 dark:text-gray-400 py-4">
            📋 Extracted health parameters from your lab report ({parameters.length} found)
          </TableCaption>
          <TableHeader>
            <TableRow className="border-b bg-gray-50 dark:bg-gray-700/50">
              <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                🏷️ Parameter
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                📊 Value
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                📏 Unit
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                📈 Normal Range
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                🎯 Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.map((param, index) => {
              // console.log(`🔍 Rendering parameter ${index}:`, param);
              return (
                <TableRow 
                  key={index} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 border-b border-gray-100 dark:border-gray-700"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-white py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>{param.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-gray-900 dark:text-white font-semibold py-4 text-lg">
                    {param.value}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                      {param.unit || '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 font-mono text-sm py-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {param.normalRange || '—'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    {getStatusBadge(param.status)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}