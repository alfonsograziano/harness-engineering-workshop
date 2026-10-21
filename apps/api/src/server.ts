import { buildApp } from './app';
import { config } from './config';
import { createDatabase } from './db/client';
import { runMigrations } from './db/migrate';

const { db, sqlite } = createDatabase(config.databasePath);
await runMigrations(db, sqlite, config.migrationsFolder);

const app = buildApp({
  db,
  logger: { level: process.env.LOG_LEVEL ?? 'info' },
});

const shutdown = async () => {
  await app.close();
  sqlite.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

try {
  await app.listen({ port: config.port, host: config.host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
