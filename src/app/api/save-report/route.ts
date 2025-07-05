import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { HealthReport } from '@/lib/models/HealthReport';
import { Types } from 'mongoose';

// Define interface for lean query results
interface LeanHealthReport {
  _id: Types.ObjectId;
  userId: string;
  fileName: string;
  fileSize?: number;
  extractedText?: string;
  healthParameters: Array<{
    name: string;
    value: string;
    unit?: string;
    normalRange?: string;
    status?: 'normal' | 'high' | 'low';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// POST - Save a new health report
export async function POST(request: NextRequest) {
  try {
    // Get user ID from request headers (NOT from Clerk)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized - Please sign in to save reports' 
        },
        { status: 401 }
      );
    }

    const { fileName, fileSize, extractedText, healthParameters } = await request.json();

    // Validate required fields
    if (!fileName || !healthParameters || !Array.isArray(healthParameters)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: fileName and healthParameters' 
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Create new health report
    const healthReport = new HealthReport({
      userId,
      fileName,
      fileSize: fileSize || 0,
      extractedText: extractedText || '',
      healthParameters,
    });

    // Save to database
    const savedReport = await healthReport.save();

    // console.log(`✅ Health report saved for user ${userId}:`, savedReport._id);

    return NextResponse.json({
      success: true,
      reportId: savedReport._id.toString(),
      message: 'Report saved successfully!',
      parametersCount: healthParameters.length
    });

  } catch (error) {
    // console.error('❌ Error saving health report:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save report. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// GET - Fetch user's health reports
export async function GET(request: NextRequest) {
  try {
    // Get user ID from request headers (NOT from Clerk)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized - Please sign in to view reports' 
        },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user's reports, sorted by most recent first
    const reports = await HealthReport.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50) // Limit to last 50 reports for performance
      .lean<LeanHealthReport[]>(); // Type the lean query result

    // console.log(`📊 Fetched ${reports.length} reports for user ${userId}`);

    return NextResponse.json({
      success: true,
      reports: reports.map(report => ({
        _id: report._id.toString(),
        fileName: report.fileName,
        fileSize: report.fileSize || 0,
        healthParameters: report.healthParameters,
        createdAt: report.createdAt,
        parametersCount: report.healthParameters?.length || 0
      })),
      totalReports: reports.length
    });

  } catch (error) {
    // console.error('❌ Error fetching health reports:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch reports. Please try again.' 
      },
      { status: 500 }
    );
  }
}
