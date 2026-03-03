import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

export const createAccessToken = (payload) => {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};
