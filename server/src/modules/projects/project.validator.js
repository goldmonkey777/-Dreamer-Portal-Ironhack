import Joi from 'joi';

export const createProjectSchema = Joi.object({
  title: Joi.string().min(2).max(120).required(),
  description: Joi.string().allow('').max(1000).default(''),
  status: Joi.string().valid('active', 'archived').default('active'),
  tags: Joi.array().items(Joi.string().max(40)).default([]),
  visibility: Joi.string().valid('private', 'public').default('private')
});

export const updateProjectSchema = Joi.object({
  title: Joi.string().min(2).max(120),
  description: Joi.string().allow('').max(1000),
  status: Joi.string().valid('active', 'archived'),
  tags: Joi.array().items(Joi.string().max(40)),
  visibility: Joi.string().valid('private', 'public')
}).min(1);

export const listProjectQuerySchema = Joi.object({
  search: Joi.string().allow(''),
  status: Joi.string().valid('active', 'archived'),
  tag: Joi.string().max(40)
});
