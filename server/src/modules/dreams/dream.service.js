import mongoose from 'mongoose';
import { Project } from '../projects/project.model.js';
import { Dream } from './dream.model.js';
import { AppError } from '../../shared/errors/AppError.js';
import { uploadDreamAttachment } from '../../shared/utils/upload.js';

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
  return Dream.create({
    ...payload,
    moodTags: payload.moodTags?.map((tag) => tag.toLowerCase()) || [],
    owner: ownerId,
    project: projectId
  });
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
  const updated = await Dream.findOneAndUpdate(
    { _id: dreamId, owner: ownerId, deletedAt: null },
    {
      ...payload,
      ...(payload.moodTags ? { moodTags: payload.moodTags.map((tag) => tag.toLowerCase()) } : {})
    },
    { new: true }
  );

  if (!updated) {
    throw new AppError('Dream not found', 404);
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
