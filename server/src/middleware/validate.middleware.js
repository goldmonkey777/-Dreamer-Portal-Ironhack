import { AppError } from '../shared/errors/AppError.js';

export const validate = (schema, location = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[location], {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const firstDetailMessage = error.details?.[0]?.message;
    return next(new AppError(firstDetailMessage || 'Validation failed', 400, error.details));
  }

  req[location] = value;
  return next();
};
