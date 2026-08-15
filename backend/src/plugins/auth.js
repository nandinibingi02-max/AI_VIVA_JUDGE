import fastifyJwt from '@fastify/jwt';
import { env } from '../config/env.js';

export async function registerAuthPlugin(fastify) {
  await fastify.register(fastifyJwt, { secret: env.jwtAccessSecret });
  await fastify.register(fastifyJwt, { secret: env.jwtRefreshSecret, namespace: 'refreshJwt' });
}
