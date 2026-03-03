import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo', index: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date, default: null, index: true },
    relatedDream: { type: mongoose.Schema.Types.ObjectId, ref: 'Dream', default: null },
    completedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, project: 1, status: 1, deletedAt: 1 });

export const Task = mongoose.model('Task', taskSchema);
