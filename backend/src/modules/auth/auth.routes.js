import { env } from '../../config/env.js';
import { authenticate } from '../../middleware/authenticate.js';
import * as controller from './auth.controller.js';

const rateLimit = { max: env.authRateLimitMax, timeWindow: env.authRateLimitWindow };
export async function authRoutes(fastify) {
  fastify.post('/register', { config: { rateLimit } }, controller.register);
  fastify.post('/login', { config: { rateLimit } }, controller.login);
  fastify.post('/refresh', { config: { rateLimit } }, controller.refresh);
  fastify.post('/logout', { config: { rateLimit } }, controller.logout);
  fastify.get('/me', { onRequest: [authenticate] }, controller.me);
  fastify.post('/change-password', { onRequest: [authenticate], config: { rateLimit } }, controller.changePassword);
}
