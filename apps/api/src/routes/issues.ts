import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { getCurrentUserId } from '../lib/current-user';
import {
  createIssueSchema,
  getIssueSchema,
  listProjectIssuesSchema,
  setIssueLabelsSchema,
  updateIssueSchema,
} from '../schemas/issues';

export const issueRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/projects/:key/issues', { schema: listProjectIssuesSchema }, async (request) => {
    return app.services.issues.listForProject(request.params.key, request.query);
  });

  app.post('/projects/:key/issues', { schema: createIssueSchema }, async (request, reply) => {
    const issue = await app.services.issues.create(request.params.key, request.body, getCurrentUserId(request));
    return reply.status(201).send(issue);
  });

  app.get('/issues/:identifier', { schema: getIssueSchema }, async (request) => {
    return app.services.issues.getByIdentifier(request.params.identifier);
  });

  app.patch('/issues/:identifier', { schema: updateIssueSchema }, async (request) => {
    return app.services.issues.update(request.params.identifier, request.body);
  });

  app.put('/issues/:identifier/labels', { schema: setIssueLabelsSchema }, async (request) => {
    return app.services.labels.setIssueLabels(request.params.identifier, request.body);
  });
};
