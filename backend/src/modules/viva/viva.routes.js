import { authenticate } from '../../middleware/authenticate.js';
import * as controller from './viva.controller.js';

export async function vivaRoutes(fastify) {
  fastify.post('/start', { onRequest: [authenticate] }, controller.start);
  fastify.post('/:projectId/answer', { onRequest: [authenticate] }, controller.answer);
  fastify.get('/:projectId/results', { onRequest: [authenticate] }, controller.results);
  fastify.get('/history', { onRequest: [authenticate] }, controller.history);
}
