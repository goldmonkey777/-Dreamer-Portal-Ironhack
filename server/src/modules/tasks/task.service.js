import mongoose from 'mongoose';
import { Project } from '../projects/project.model.js';
import { Task } from './task.model.js';
import { AppError } from '../../shared/errors/AppError.js';

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

export const listTasksByProject = async (ownerId, projectId, query) => {
  await ensureProjectOwnership(projectId, ownerId);
  const filter = { owner: ownerId, project: projectId, deletedAt: null };

  if (query.status) {
    filter.status = query.status;
  }

  return Task.find(filter).sort({ createdAt: -1 });
};

export const createTask = async (ownerId, projectId, payload) => {
  await ensureProjectOwnership(projectId, ownerId);
  return Task.create({ ...payload, owner: ownerId, project: projectId });
};

export const updateTask = async (ownerId, taskId, payload) => {
  ensureObjectId(taskId);
  const updateData = { ...payload };

  if (payload.status === 'done' && !payload.completedAt) {
    updateData.completedAt = new Date();
  }

  if (payload.status && payload.status !== 'done') {
    updateData.completedAt = null;
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, owner: ownerId, deletedAt: null },
    updateData,
    { new: true }
  );

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
};

export const softDeleteTask = async (ownerId, taskId) => {
  ensureObjectId(taskId);
  const task = await Task.findOneAndUpdate(
    { _id: taskId, owner: ownerId, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
};
