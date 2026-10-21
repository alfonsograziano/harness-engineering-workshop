import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { getProjectSchema, listProjectsSchema } from '../schemas/projects';

export const projectRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/projects', { schema: listProjectsSchema }, async () => {
    return app.services.projects.list();
  });

  app.get('/projects/:key', { schema: getProjectSchema }, async (request) => {
    return app.services.projects.getByKey(request.params.key);
  });
};
