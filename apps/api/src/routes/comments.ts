import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { getCurrentUserId } from '../lib/current-user';
import { createCommentSchema, listCommentsSchema } from '../schemas/comments';

export const commentRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/issues/:identifier/comments', { schema: listCommentsSchema }, async (request) => {
    return app.services.comments.listForIssue(request.params.identifier);
  });

  app.post('/issues/:identifier/comments', { schema: createCommentSchema }, async (request, reply) => {
    const comment = await app.services.comments.create(
      request.params.identifier,
      request.body,
      getCurrentUserId(request),
    );
    return reply.status(201).send(comment);
  });
};
