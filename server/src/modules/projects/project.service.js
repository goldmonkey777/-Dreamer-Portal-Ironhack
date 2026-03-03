import mongoose from 'mongoose';
import { AppError } from '../../shared/errors/AppError.js';
import { Project } from './project.model.js';

const ensureObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid id', 400);
  }
};

export const listProjects = async (ownerId, query) => {
  const filter = { owner: ownerId, deletedAt: null };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.tag) {
    filter.tags = query.tag.toLowerCase();
  }

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } }
    ];
  }

  return Project.find(filter).sort({ updatedAt: -1 });
};

export const createProject = async (ownerId, payload) => {
  return Project.create({
    ...payload,
    tags: payload.tags?.map((tag) => tag.toLowerCase()) || [],
    owner: ownerId
  });
};

export const getProjectById = async (ownerId, id) => {
  ensureObjectId(id);
  const project = await Project.findOne({ _id: id, owner: ownerId, deletedAt: null });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  return project;
};

export const updateProject = async (ownerId, id, payload) => {
  ensureObjectId(id);
  const updated = await Project.findOneAndUpdate(
    { _id: id, owner: ownerId, deletedAt: null },
    {
      ...payload,
      ...(payload.tags ? { tags: payload.tags.map((tag) => tag.toLowerCase()) } : {})
    },
    { new: true }
  );

  if (!updated) {
    throw new AppError('Project not found', 404);
  }

  return updated;
};

export const softDeleteProject = async (ownerId, id) => {
  ensureObjectId(id);
  const deleted = await Project.findOneAndUpdate(
    { _id: id, owner: ownerId, deletedAt: null },
    { deletedAt: new Date(), status: 'archived' },
    { new: true }
  );

  if (!deleted) {
    throw new AppError('Project not found', 404);
  }

  return deleted;
};
