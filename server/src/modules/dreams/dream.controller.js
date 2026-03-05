import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import * as dreamService from './dream.service.js';

export const listDreamsByProject = asyncHandler(async (req, res) => {
  const dreams = await dreamService.listDreamsByProject(req.user.id, req.params.projectId, req.query);
  res.status(200).json({ success: true, data: dreams });
});

export const createDream = asyncHandler(async (req, res) => {
  const dream = await dreamService.createDream(req.user.id, req.params.projectId, req.body);
  res.status(201).json({ success: true, data: dream });
});

export const getDream = asyncHandler(async (req, res) => {
  const dream = await dreamService.getDreamById(req.user.id, req.params.id);
  res.status(200).json({ success: true, data: dream });
});

export const updateDream = asyncHandler(async (req, res) => {
  const dream = await dreamService.updateDream(req.user.id, req.params.id, req.body);
  res.status(200).json({ success: true, data: dream });
});

export const deleteDream = asyncHandler(async (req, res) => {
  await dreamService.softDeleteDream(req.user.id, req.params.id);
  res.status(200).json({ success: true, message: 'Dream archived' });
});

export const uploadDreamAttachment = asyncHandler(async (req, res) => {
  const dream = await dreamService.attachImage(req.user.id, req.params.id, req.body.dataUri);
  res.status(200).json({ success: true, data: dream });
});

export const analyzeDream = asyncHandler(async (req, res) => {
  const dream = await dreamService.requestDreamAnalysis(req.user.id, req.params.id);
  res.status(202).json({
    success: true,
    message: 'Dream analysis queued',
    data: dream
  });
});
