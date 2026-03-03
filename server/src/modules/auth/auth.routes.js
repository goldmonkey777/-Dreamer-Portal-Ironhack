import { Router } from 'express';
import { login, signup, verify } from './auth.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { loginSchema, signupSchema } from './auth.validator.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

export const authRoutes = Router();

authRoutes.post('/signup', validate(signupSchema), signup);
authRoutes.post('/login', validate(loginSchema), login);
authRoutes.get('/verify', requireAuth, verify);
