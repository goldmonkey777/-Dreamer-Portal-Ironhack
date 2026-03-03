import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createTask, deleteTask, listTasksByProject, updateTask } from './task.controller.js';
import { createTaskSchema, listTaskQuerySchema, updateTaskSchema } from './task.validator.js';

export const taskRoutes = Router();

taskRoutes.use(requireAuth);
taskRoutes.get('/projects/:projectId/tasks', validate(listTaskQuerySchema, 'query'), listTasksByProject);
taskRoutes.post('/projects/:projectId/tasks', validate(createTaskSchema), createTask);
taskRoutes.put('/tasks/:id', validate(updateTaskSchema), updateTask);
taskRoutes.delete('/tasks/:id', deleteTask);
