import fastifyCors from '@fastify/cors';
import { env } from '../config/env.js';

export const registerCorsPlugin = (fastify) => fastify.register(fastifyCors, {
  origin: (origin, callback) => callback(null, !origin || env.corsOrigins.includes(origin)),
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
});
