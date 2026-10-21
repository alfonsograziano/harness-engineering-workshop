// apps/api/src/routes/milestones.ts
// Then register it in apps/api/src/app.ts, inside the /api prefix:
//   await api.register(milestoneRoutes);

import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createMilestoneSchema, listMilestonesSchema } from '../schemas/milestones';

export const milestoneRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/projects/:key/milestones', { schema: listMilestonesSchema }, async (request) => {
    return app.services.milestones.listForProject(request.params.key);
  });

  app.post('/projects/:key/milestones', { schema: createMilestoneSchema }, async (request, reply) => {
    const milestone = await app.services.milestones.create(request.params.key, request.body);
    return reply.status(201).send(milestone);
  });
};
