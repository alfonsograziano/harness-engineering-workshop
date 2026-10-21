import type { DatabaseSync } from 'node:sqlite';
import { migrate } from 'drizzle-orm/sqlite-proxy/migrator';
import type { Database } from './client';

/** Applies the SQL migrations in apps/api/drizzle that have not run yet. */
export async function runMigrations(db: Database, sqlite: DatabaseSync, migrationsFolder: string) {
  await migrate(
    db,
    async (queries) => {
      sqlite.exec('BEGIN');
      try {
        for (const query of queries) {
          sqlite.exec(query);
        }
        sqlite.exec('COMMIT');
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
    { migrationsFolder },
  );
}
