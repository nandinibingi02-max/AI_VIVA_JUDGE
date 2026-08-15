export class AppError extends Error {
  constructor(statusCode, code, message, details) { super(message); this.statusCode = statusCode; this.code = code; this.details = details; }
}
export const validationError = (issues) => new AppError(400, 'VALIDATION_ERROR', 'Invalid request data.', issues);
export const fileTooLarge = () => new AppError(413, 'FILE_TOO_LARGE', 'Project file must be 10 MB or smaller.');
export const unauthorized = () => new AppError(401, 'UNAUTHORIZED', 'Authentication is required.');
export const invalidCredentials = () => new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
export const aiServiceUnavailable = () => new AppError(503, 'AI_SERVICE_UNAVAILABLE', 'The viva evaluation service is currently unavailable.');
