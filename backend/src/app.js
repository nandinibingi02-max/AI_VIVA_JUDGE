import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import { registerCorsPlugin } from './plugins/cors.js';
import { registerHelmetPlugin } from './plugins/helmet.js';
import { registerRateLimitPlugin } from './plugins/rateLimit.js';
import { registerAuthPlugin } from './plugins/auth.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { vivaRoutes } from './modules/viva/viva.routes.js';
import { AppError } from './utils/errors.js';
import { env } from './config/env.js';

export async function buildApp() {
  const app = Fastify({ logger: true });
  await app.register(fastifyCookie);
  await app.register(fastifyMultipart, { limits: { files: 1, fileSize: 10 * 1024 * 1024 } });
  await registerHelmetPlugin(app);
  await registerCorsPlugin(app);
  await registerRateLimitPlugin(app);
  await registerAuthPlugin(app);
  app.setErrorHandler((error, request, reply) => {
    if (request.headers.origin === env.corsOrigin) {
      reply.header('access-control-allow-origin', env.corsOrigin);
      reply.header('access-control-allow-credentials', 'true');
    }
    if (error instanceof AppError) return reply.code(error.statusCode).send({ error: { code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) } });
    if (error.statusCode && error.statusCode < 500) return reply.code(error.statusCode).send({ error: { code: error.code ?? 'REQUEST_ERROR', message: error.statusCode === 429 ? 'Too many requests. Please try again later.' : 'Request could not be completed.' } });
    request.log.error(error);
    return reply.code(500).send({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } });
  });
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(vivaRoutes, { prefix: '/api/viva' });
  return app;
}
