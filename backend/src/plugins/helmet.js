import fastifyHelmet from '@fastify/helmet';

export const registerHelmetPlugin = (fastify) => fastify.register(fastifyHelmet);
