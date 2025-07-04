'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Tesseract from 'tesseract.js';

// This will be populated by the useEffect hook
let pdfjsLib: any = null;

interface HealthParameter {
  name: string;
  value: string;
  unit?: string;
  normalRange?: string;
  status?: 'normal' | 'high' | 'low';
}

interface FileUploadProps {
  onDataExtracted: (data: HealthParameter[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  onReportSaved?: () => void; 
}

export default function FileUpload({ onDataExtracted, isProcessing, setIsProcessing, onReportSaved }: FileUploadProps) {
  const { isSignedIn, user } = useUser();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FINAL FIX: Initialize PDF.js using a local worker file
  useEffect(() => {
    const initPdfJs = async () => {
      if (typeof window !== 'undefined' && !pdfjsLib) {
        try {
          // Import the main library using the correct path
          const pdfjs = await import('pdfjs-dist');
          
          // Point to the worker file we copied to the public folder
          pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
          
          pdfjsLib = pdfjs;
          // console.log('✅ PDF.js initialized successfully with local worker.');
        } catch (initError) {
          // console.error('❌ Failed to initialize PDF.js:', initError);
          setError("Could not load PDF viewer. Please try refreshing the page.");
        }
      }
    };
    
    initPdfJs();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setError('');
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or image file (JPEG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
    setProgress('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Convert PDF to image with better error handling
  const convertPdfToImage = async (file: File): Promise<string> => {
    if (!pdfjsLib) {
      throw new Error('PDF.js not initialized. Please wait a moment and try again.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
          
          const loadingTask = pdfjsLib.getDocument({
            data: typedArray,
            useSystemFonts: true,
            disableFontFace: false,
          });
          
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1);
          
          const scale = 2.0;
          const viewport = page.getViewport({ scale });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          
          await page.render(renderContext).promise;
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve(url);
            } else {
              reject(new Error('Failed to convert PDF to image'));
            }
          }, 'image/png', 0.95);
          
        } catch (error) {
          // console.error('PDF conversion error:', error);
          reject(new Error(`PDF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async () => {
    if (!uploadedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsProcessing(true);
    setError('');
    setProgress('Starting file analysis...');

    try {
      let imageUrl: string;
      
      if (uploadedFile.type === 'application/pdf') {
        // console.log('🔄 Converting PDF to image...');
        setProgress('Converting PDF to image...');
        imageUrl = await convertPdfToImage(uploadedFile);
        setProgress('PDF converted successfully');
      } else {
        imageUrl = URL.createObjectURL(uploadedFile);
        setProgress('Image loaded');
      }

      // console.log('🔍 Starting OCR processing...');
      setProgress('Extracting text from image...');
      
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setProgress(`Extracting text: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      
      const { data: { text } } = await worker.recognize(imageUrl);
      await worker.terminate();
      
      URL.revokeObjectURL(imageUrl);

      // console.log('📄 Extracted text:', text);
      setProgress('Analyzing health parameters...');

      const response = await fetch('/api/process-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse health data');
      }

      const result = await response.json();

      if (isSignedIn && user?.id && result.parameters?.length > 0) {
        setProgress('Saving report to your account...');
        
        try {
          const saveResponse = await fetch('/api/save-report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': user.id,
            },
            body: JSON.stringify({
              fileName: uploadedFile.name,
              fileSize: uploadedFile.size,
              extractedText: text,
              healthParameters: result.parameters,
            }),
          });

          const saveResult = await saveResponse.json();
          
          if (saveResult.success) {
            setProgress('✅ Report saved to your account!');
            if (onReportSaved) {
              onReportSaved();
            }
          } else {
            setProgress('⚠️ Analysis complete (save failed)');
          }
        } catch (saveError) {
          setProgress('⚠️ Analysis complete (save failed)');
        }
      } else if (!isSignedIn) {
        setProgress('✅ Analysis complete! (Sign in to save reports)');
      } else {
        setProgress('✅ Analysis complete!');
      }

      onDataExtracted(result.parameters || []);
      
      setTimeout(() => {
        setProgress('');
      }, 4000);
      
    } catch (err) {
      // console.error('❌ Processing error:', err);
      setError(`Failed to process the file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setProgress('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!uploadedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileInputChange}
            disabled={isProcessing}
            aria-label="Upload lab report file"
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Drop your lab report here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                or click to browse files
              </p>
            </div>
            
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Supports PDF, JPEG, PNG, WebP (max 10MB)
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 bg-white dark:bg-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {uploadedFile.type === 'application/pdf' ? (
                <FileText className="h-8 w-8 text-red-500" />
              ) : (
                <ImageIcon className="h-8 w-8 text-blue-500" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              disabled={isProcessing}
              aria-label="Remove file"
              title="Remove file"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {progress && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-700 dark:text-blue-300 text-sm">{progress}</p>
            </div>
          )}
          
          <button
            onClick={processFile}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isProcessing ? 'Processing...' : 'Extract Health Data'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

