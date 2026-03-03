import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import * as taskService from './task.service.js';

export const listTasksByProject = asyncHandler(async (req, res) => {
  const tasks = await taskService.listTasksByProject(req.user.id, req.params.projectId, req.query);
  res.status(200).json({ success: true, data: tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user.id, req.params.projectId, req.body);
  res.status(201).json({ success: true, data: task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
  res.status(200).json({ success: true, data: task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.softDeleteTask(req.user.id, req.params.id);
  res.status(200).json({ success: true, message: 'Task archived' });
});
