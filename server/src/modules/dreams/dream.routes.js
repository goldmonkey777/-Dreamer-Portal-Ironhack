import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  analyzeDream,
  createDream,
  deleteDream,
  getDream,
  listDreamsByProject,
  updateDream,
  uploadDreamAttachment
} from './dream.controller.js';
import {
  createDreamSchema,
  listDreamQuerySchema,
  updateDreamSchema,
  uploadAttachmentSchema
} from './dream.validator.js';

export const dreamRoutes = Router();

dreamRoutes.use(requireAuth);
dreamRoutes.get('/projects/:projectId/dreams', validate(listDreamQuerySchema, 'query'), listDreamsByProject);
dreamRoutes.post('/projects/:projectId/dreams', validate(createDreamSchema), createDream);
dreamRoutes.get('/dreams/:id', getDream);
dreamRoutes.put('/dreams/:id', validate(updateDreamSchema), updateDream);
dreamRoutes.delete('/dreams/:id', deleteDream);
dreamRoutes.post('/dreams/:id/attachments', validate(uploadAttachmentSchema), uploadDreamAttachment);
dreamRoutes.post('/dreams/:id/analyze', analyzeDream);
