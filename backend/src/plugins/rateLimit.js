import fastifyRateLimit from '@fastify/rate-limit';

export const registerRateLimitPlugin = (fastify) => fastify.register(fastifyRateLimit, { global: false });
