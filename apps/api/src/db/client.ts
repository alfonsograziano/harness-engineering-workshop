import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema from './schema';

export type Database = ReturnType<typeof createDatabase>['db'];

/**
 * Opens a SQLite database with the built-in node:sqlite module and wraps it with Drizzle.
 * Pass ':memory:' for a throwaway database.
 */
export function createDatabase(databasePath: string) {
  if (databasePath !== ':memory:') {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  const sqlite = new DatabaseSync(databasePath);
  sqlite.exec('PRAGMA foreign_keys = ON;');
  sqlite.exec('PRAGMA journal_mode = WAL;');

  const db = drizzle(
    async (sql, params, method) => {
      const statement = sqlite.prepare(sql);
      const values = params as SQLInputValue[];

      if (method === 'run') {
        statement.run(...values);
        return { rows: [] };
      }

      statement.setReturnArrays(true);
      if (method === 'get') {
        return { rows: (statement.get(...values) as unknown[] | undefined) ?? [] };
      }
      return { rows: statement.all(...values) as unknown[] };
    },
    { schema },
  );

  return { db, sqlite };
}
