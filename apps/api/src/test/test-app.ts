import { buildApp } from '../app';
import { config } from '../config';
import { createDatabase } from '../db/client';
import { runMigrations } from '../db/migrate';
import { issues, projects, users } from '../db/schema';
import { createServices } from '../services';

const CREATED_AT = '2026-01-15T09:00:00.000Z';

/**
 * A fresh in-memory database with the real migrations and a small, known fixture:
 * two users, the WEB and API projects, and one issue (WEB-1).
 */
async function createTestDatabase() {
  const { db, sqlite } = createDatabase(':memory:');
  await runMigrations(db, sqlite, config.migrationsFolder);

  await db.insert(users).values([
    { name: 'Ada Lovelace', email: 'ada@example.com' },
    { name: 'Alan Turing', email: 'alan@example.com' },
  ]);
  await db.insert(projects).values([
    { key: 'WEB', name: 'Web App', issueCounter: 1, createdAt: CREATED_AT },
    { key: 'API', name: 'Platform API', issueCounter: 0, createdAt: CREATED_AT },
  ]);
  await db.insert(issues).values({
    projectId: 1,
    number: 1,
    title: 'First issue',
    status: 'todo',
    priority: 'medium',
    creatorId: 1,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  });

  return { db, sqlite };
}

export async function createTestServices() {
  const { db } = await createTestDatabase();
  return createServices(db);
}

export async function createTestApp() {
  const { db } = await createTestDatabase();
  const app = buildApp({ db });
  await app.ready();
  return app;
}
