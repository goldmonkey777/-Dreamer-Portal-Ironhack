import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(2).max(160).required(),
  description: Joi.string().allow('').max(1000).default(''),
  status: Joi.string().valid('todo', 'doing', 'done').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  dueDate: Joi.date().allow(null),
  relatedDream: Joi.string().allow(null, '')
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(2).max(160),
  description: Joi.string().allow('').max(1000),
  status: Joi.string().valid('todo', 'doing', 'done'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  dueDate: Joi.date().allow(null),
  relatedDream: Joi.string().allow(null, ''),
  completedAt: Joi.date().allow(null)
}).min(1);

export const listTaskQuerySchema = Joi.object({
  status: Joi.string().valid('todo', 'doing', 'done')
});
