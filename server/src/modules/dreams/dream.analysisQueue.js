import mongoose from 'mongoose';
import { Dream } from './dream.model.js';
import { resolveDreamInterpretation } from './dream.analysis.js';

const queuedDreamIds = new Set();
let workerIsRunning = false;

const ensureObjectIdString = (dreamId) => {
  if (!dreamId || !mongoose.Types.ObjectId.isValid(dreamId)) {
    return null;
  }

  return String(dreamId);
};

const getNextDreamId = () => {
  const firstEntry = queuedDreamIds.values().next();
  return firstEntry.done ? null : firstEntry.value;
};

const processDream = async (dreamId) => {
  const dream = await Dream.findOneAndUpdate(
    { _id: dreamId, deletedAt: null },
    {
      $set: {
        'analysis.status': 'processing',
        'analysis.error': ''
      }
    },
    { new: true }
  );

  if (!dream) {
    return;
  }

  try {
    const result = await resolveDreamInterpretation(dream.toObject());
    await Dream.findByIdAndUpdate(dream._id, {
      $set: {
        'analysis.status': 'processed',
        'analysis.summary': result.summary,
        'analysis.symbols': result.symbols,
        'analysis.archetypes': result.archetypes,
        'analysis.suggestedAction': result.suggestedAction,
        'analysis.disclaimer': result.disclaimer,
        'analysis.source': result.source,
        'analysis.model': result.model,
        'analysis.processed': true,
        'analysis.processedAt': new Date(),
        'analysis.error': ''
      }
    });
  } catch (error) {
    await Dream.findByIdAndUpdate(dream._id, {
      $set: {
        'analysis.status': 'failed',
        'analysis.processed': false,
        'analysis.processedAt': null,
        'analysis.error': error instanceof Error ? error.message : 'Unknown analysis error'
      }
    });
  }
};

const runWorker = async () => {
  if (workerIsRunning) {
    return;
  }

  workerIsRunning = true;

  while (queuedDreamIds.size > 0) {
    const nextDreamId = getNextDreamId();
    if (!nextDreamId) {
      break;
    }

    queuedDreamIds.delete(nextDreamId);
    await processDream(nextDreamId);
  }

  workerIsRunning = false;
};

export const enqueueDreamAnalysis = (dreamId) => {
  const normalizedId = ensureObjectIdString(dreamId);
  if (!normalizedId) {
    return;
  }

  queuedDreamIds.add(normalizedId);
  setTimeout(() => {
    runWorker().catch(() => {
      workerIsRunning = false;
    });
  }, 0);
};
