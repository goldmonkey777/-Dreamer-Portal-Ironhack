import mongoose from 'mongoose';
import { Project } from '../projects/project.model.js';
import { Dream } from './dream.model.js';
import { AppError } from '../../shared/errors/AppError.js';
import { uploadDreamAttachment } from '../../shared/utils/upload.js';
import { enqueueDreamAnalysis } from './dream.analysisQueue.js';

const ensureObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid id', 400);
  }
};

const ensureProjectOwnership = async (projectId, ownerId) => {
  ensureObjectId(projectId);
  const project = await Project.findOne({ _id: projectId, owner: ownerId, deletedAt: null }).select('_id');
  if (!project) {
    throw new AppError('Project not found', 404);
  }
};

export const listDreamsByProject = async (ownerId, projectId, query) => {
  await ensureProjectOwnership(projectId, ownerId);
  const filter = { owner: ownerId, project: projectId, deletedAt: null };

  if (query.mood) {
    filter.moodTags = query.mood.toLowerCase();
  }

  if (query.lucidity) {
    filter.lucidityLevel = query.lucidity;
  }

  return Dream.find(filter).sort({ dreamDate: -1, createdAt: -1 });
};

export const createDream = async (ownerId, projectId, payload) => {
  await ensureProjectOwnership(projectId, ownerId);
  const created = await Dream.create({
    ...payload,
    moodTags: payload.moodTags?.map((tag) => tag.toLowerCase()) || [],
    owner: ownerId,
    project: projectId,
    analysis: {
      status: 'pending',
      summary: '',
      symbols: [],
      archetypes: [],
      suggestedAction: '',
      processed: false,
      error: ''
    }
  });

  enqueueDreamAnalysis(created._id);
  return created;
};

export const getDreamById = async (ownerId, dreamId) => {
  ensureObjectId(dreamId);
  const dream = await Dream.findOne({ _id: dreamId, owner: ownerId, deletedAt: null });
  if (!dream) {
    throw new AppError('Dream not found', 404);
  }

  return dream;
};

export const updateDream = async (ownerId, dreamId, payload) => {
  ensureObjectId(dreamId);
  const shouldReprocessAnalysis =
    payload.title !== undefined ||
    payload.content !== undefined ||
    payload.moodTags !== undefined ||
    payload.lucidityLevel !== undefined ||
    payload.dreamDate !== undefined;

  const updated = await Dream.findOneAndUpdate(
    { _id: dreamId, owner: ownerId, deletedAt: null },
    {
      ...payload,
      ...(payload.moodTags ? { moodTags: payload.moodTags.map((tag) => tag.toLowerCase()) } : {}),
      ...(shouldReprocessAnalysis
        ? {
            analysis: {
              status: 'pending',
              summary: '',
              symbols: [],
              archetypes: [],
              suggestedAction: '',
              processed: false,
              error: ''
            }
          }
        : {})
    },
    { new: true }
  );

  if (!updated) {
    throw new AppError('Dream not found', 404);
  }

  if (shouldReprocessAnalysis) {
    enqueueDreamAnalysis(updated._id);
  }

  return updated;
};

export const softDeleteDream = async (ownerId, dreamId) => {
  ensureObjectId(dreamId);
  const deleted = await Dream.findOneAndUpdate(
    { _id: dreamId, owner: ownerId, deletedAt: null },
    { deletedAt: new Date(), isArchived: true },
    { new: true }
  );

  if (!deleted) {
    throw new AppError('Dream not found', 404);
  }

  return deleted;
};

export const attachImage = async (ownerId, dreamId, dataUri) => {
  const dream = await getDreamById(ownerId, dreamId);
  const attachment = await uploadDreamAttachment(dataUri);
  dream.attachments.push(attachment);
  await dream.save();
  return dream;
};

export const requestDreamAnalysis = async (ownerId, dreamId) => {
  const dream = await getDreamById(ownerId, dreamId);
  dream.analysis = {
    ...dream.analysis,
    status: 'pending',
    processed: false,
    error: ''
  };
  await dream.save();
  enqueueDreamAnalysis(dream._id);
  return dream;
};
