import bcrypt from 'bcryptjs';
import { User } from '../users/user.model.js';
import { AppError } from '../../shared/errors/AppError.js';
import { createAccessToken } from '../../shared/utils/token.js';

const buildAuthResponse = (user) => {
  const token = createAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};

export const signup = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: hashedPassword
  });

  return buildAuthResponse(user);
};

export const login = async (payload) => {
  const user = await User.findOne({ email: payload.email.toLowerCase() });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isValid = await bcrypt.compare(payload.password, user.password);
  if (!isValid) {
    throw new AppError('Invalid credentials', 401);
  }

  return buildAuthResponse(user);
};

export const getSessionUser = async (userId) => {
  const user = await User.findById(userId).select('_id email name role');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  };
};
