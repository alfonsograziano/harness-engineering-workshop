import Fastify, { type FastifyServerOptions } from 'fastify';
import type { Database } from './db/client';
import { registerErrorHandler } from './errors';
import { commentRoutes } from './routes/comments';
import { issueRoutes } from './routes/issues';
import { projectRoutes } from './routes/projects';
import { userRoutes } from './routes/users';
import { createServices, type Services } from './services';

declare module 'fastify' {
  interface FastifyInstance {
    services: Services;
  }
}

interface BuildAppOptions {
  db: Database;
  logger?: FastifyServerOptions['logger'];
}

export function buildApp({ db, logger = false }: BuildAppOptions) {
  const app = Fastify({ logger });

  app.decorate('services', createServices(db));
  registerErrorHandler(app);

  app.get('/health', async () => ({ status: 'ok' }));

  app.register(
    async (api) => {
      await api.register(userRoutes);
      await api.register(projectRoutes);
      await api.register(issueRoutes);
      await api.register(commentRoutes);
    },
    { prefix: '/api' },
  );

  return app;
}
