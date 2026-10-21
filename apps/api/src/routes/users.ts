import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { listUsersSchema } from '../schemas/users';

export const userRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/users', { schema: listUsersSchema }, async () => {
    return app.services.users.list();
  });
};
