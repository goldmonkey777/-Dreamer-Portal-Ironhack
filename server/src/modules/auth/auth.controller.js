import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import * as authService from './auth.service.js';

export const signup = asyncHandler(async (req, res) => {
  const data = await authService.signup(req.body);
  res.status(201).json({ success: true, ...data });
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json({ success: true, ...data });
});

export const verify = asyncHandler(async (req, res) => {
  const user = await authService.getSessionUser(req.user.id);
  res.status(200).json({ success: true, user });
});
