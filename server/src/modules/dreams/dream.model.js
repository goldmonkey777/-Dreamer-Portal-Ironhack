import mongoose from 'mongoose';

const dreamSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    dreamDate: { type: Date, required: true, index: true },
    moodTags: [{ type: String, trim: true, lowercase: true, index: true }],
    lucidityLevel: { type: Number, min: 1, max: 5, default: 3 },
    attachments: [
      {
        url: String,
        type: String
      }
    ],
    analysis: {
      summary: { type: String, default: '' },
      symbols: [{ type: String }],
      archetypes: [{ type: String }],
      processed: { type: Boolean, default: false }
    },
    isArchived: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

dreamSchema.index({ owner: 1, project: 1, dreamDate: -1, deletedAt: 1 });

export const Dream = mongoose.model('Dream', dreamSchema);
