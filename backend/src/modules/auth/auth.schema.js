import { z } from 'zod';
import { validationError } from '../../utils/errors.js';

const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string()
  .min(8, 'Password must contain at least 8 characters.')
  .max(128)
  .regex(/[a-z]/, 'Password must include a lowercase letter.')
  .regex(/[A-Z]/, 'Password must include an uppercase letter.')
  .regex(/\d/, 'Password must include a number.')
  .regex(/[^A-Za-z0-9]/, 'Password must include a symbol.');
const parse = (schema, value) => { const result = schema.safeParse(value); if (!result.success) throw validationError(result.error.issues.map(({ path, message }) => ({ path: path.join('.'), message }))); return result.data; };

export const registerSchema = { parse: (body) => parse(z.object({ name: z.string().trim().min(1).max(100), email, password }), body) };
export const loginSchema = { parse: (body) => parse(z.object({ email, password }), body) };
export const changePasswordSchema = { parse: (body) => parse(z.object({ currentPassword: password, newPassword: password }).refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, { message: 'New password must be different.', path: ['newPassword'] }), body) };
