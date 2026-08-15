export class AppError extends Error {
  constructor(statusCode, code, message, details) { super(message); this.statusCode = statusCode; this.code = code; this.details = details; }
}
export const validationError = (issues) => new AppError(400, 'VALIDATION_ERROR', 'Invalid request data.', issues);
export const unauthorized = () => new AppError(401, 'UNAUTHORIZED', 'Authentication is required.');
export const invalidCredentials = () => new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
