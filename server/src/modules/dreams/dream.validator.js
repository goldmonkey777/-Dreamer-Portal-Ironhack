import Joi from 'joi';

export const createDreamSchema = Joi.object({
  title: Joi.string().min(2).max(160).required(),
  content: Joi.string().min(3).required(),
  dreamDate: Joi.date().required(),
  moodTags: Joi.array().items(Joi.string().max(40)).default([]),
  lucidityLevel: Joi.number().integer().min(1).max(5).default(3)
});

export const updateDreamSchema = Joi.object({
  isArchived: Joi.boolean()
}).min(1);

export const analysisDecisionSchema = Joi.object({
  decision: Joi.string().valid('pending', 'accepted', 'ignored').required()
});

export const listDreamQuerySchema = Joi.object({
  mood: Joi.string().max(40),
  lucidity: Joi.number().integer().min(1).max(5)
});

export const uploadAttachmentSchema = Joi.object({
  dataUri: Joi.string().required()
});
