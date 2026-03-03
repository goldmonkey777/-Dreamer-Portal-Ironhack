import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { projectRoutes } from './modules/projects/project.routes.js';
import { dreamRoutes } from './modules/dreams/dream.routes.js';
import { taskRoutes } from './modules/tasks/task.routes.js';

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'DreamerPortal API online' });
});

app.use('/auth', authRoutes);
app.use('/api', dreamRoutes);
app.use('/api', taskRoutes);
app.use('/api/projects', projectRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
