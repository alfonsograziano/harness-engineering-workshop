import path from 'node:path';

const apiRoot = path.resolve(import.meta.dirname, '..');

export const config = {
  port: Number(process.env.PORT ?? 3001),
  host: process.env.HOST ?? '127.0.0.1',
  databasePath: process.env.DATABASE_PATH ?? path.join(apiRoot, 'data', 'tasklane.db'),
  migrationsFolder: path.join(apiRoot, 'drizzle'),
};
