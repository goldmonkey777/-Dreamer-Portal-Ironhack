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
    rawRecordLocked: { type: Boolean, default: true },
    analysis: {
      status: {
        type: String,
        enum: ['pending', 'processing', 'processed', 'failed'],
        default: 'pending'
      },
      summary: { type: String, default: '' },
      symbols: [{ type: String }],
      archetypes: [{ type: String }],
      suggestedAction: { type: String, default: '' },
      disclaimer: {
        type: String,
        default:
          'Esta interpretação é simbólica e reflexiva. Não substitui aconselhamento clínico, psicológico, espiritual ou médico.'
      },
      source: { type: String, default: 'pending' },
      model: { type: String, default: '' },
      userDecision: {
        type: String,
        enum: ['pending', 'accepted', 'ignored'],
        default: 'pending'
      },
      processed: { type: Boolean, default: false },
      processedAt: { type: Date, default: null },
      error: { type: String, default: '' }
    },
    interpretationLayers: [
      {
        kind: {
          type: String,
          enum: ['primary', 'jungian', 'tarot', 'mythological', 'personal-pattern', 'other'],
          default: 'primary'
        },
        summary: { type: String, default: '' },
        symbols: [{ type: String }],
        archetypes: [{ type: String }],
        suggestedAction: { type: String, default: '' },
        source: { type: String, default: '' },
        model: { type: String, default: '' },
        disclaimer: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    isArchived: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

dreamSchema.index({ owner: 1, project: 1, dreamDate: -1, deletedAt: 1 });

export const Dream = mongoose.model('Dream', dreamSchema);
