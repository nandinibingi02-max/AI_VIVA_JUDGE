import fastifyCors from '@fastify/cors';
import { env } from '../config/env.js';

export const registerCorsPlugin = (fastify) => fastify.register(fastifyCors, { origin: env.corsOrigin, credentials: true, methods: ['GET', 'POST', 'OPTIONS'] });
