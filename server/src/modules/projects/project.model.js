import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['active', 'archived'], default: 'active', index: true },
    tags: [{ type: String, trim: true, lowercase: true, index: true }],
    visibility: { type: String, enum: ['private', 'public'], default: 'private' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1, status: 1, deletedAt: 1 });
projectSchema.index({ owner: 1, tags: 1, deletedAt: 1 });

export const Project = mongoose.model('Project', projectSchema);
