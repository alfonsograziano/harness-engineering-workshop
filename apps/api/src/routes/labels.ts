import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createLabelSchema, listLabelsSchema } from '../schemas/labels';

export const labelRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/projects/:key/labels', { schema: listLabelsSchema }, async (request) => {
    return app.services.labels.listForProject(request.params.key);
  });

  app.post('/projects/:key/labels', { schema: createLabelSchema }, async (request, reply) => {
    const label = await app.services.labels.create(request.params.key, request.body);
    return reply.status(201).send(label);
  });
};
