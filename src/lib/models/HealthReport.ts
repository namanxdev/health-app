import mongoose from 'mongoose';

const HealthParameterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  normalRange: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['normal', 'high', 'low'],
    default: null
  }
});

const HealthReportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // Index for faster queries by user
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    default: 0
  },
  extractedText: {
    type: String,
    default: ''
  },
  healthParameters: [HealthParameterSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
HealthReportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Export the model, avoiding re-compilation in development
export const HealthReport = mongoose.models.HealthReport || 
  mongoose.model('HealthReport', HealthReportSchema);

export type { HealthParameterSchema, HealthReportSchema };
