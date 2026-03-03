import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject
} from './project.controller.js';
import {
  createProjectSchema,
  listProjectQuerySchema,
  updateProjectSchema
} from './project.validator.js';

export const projectRoutes = Router();

projectRoutes.use(requireAuth);
projectRoutes.get('/', validate(listProjectQuerySchema, 'query'), listProjects);
projectRoutes.post('/', validate(createProjectSchema), createProject);
projectRoutes.get('/:id', getProject);
projectRoutes.put('/:id', validate(updateProjectSchema), updateProject);
projectRoutes.delete('/:id', deleteProject);
