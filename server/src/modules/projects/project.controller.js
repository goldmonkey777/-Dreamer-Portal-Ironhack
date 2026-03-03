import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import * as projectService from './project.service.js';

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.listProjects(req.user.id, req.query);
  res.status(200).json({ success: true, data: projects });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.user.id, req.body);
  res.status(201).json({ success: true, data: project });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.user.id, req.params.id);
  res.status(200).json({ success: true, data: project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.user.id, req.params.id, req.body);
  res.status(200).json({ success: true, data: project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.softDeleteProject(req.user.id, req.params.id);
  res.status(200).json({ success: true, message: 'Project archived' });
});
