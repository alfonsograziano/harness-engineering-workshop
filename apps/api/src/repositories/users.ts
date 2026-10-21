import { asc, eq } from 'drizzle-orm';
import type { Database } from '../db/client';
import { users } from '../db/schema';

export function createUserRepository(db: Database) {
  return {
    async list() {
      return db.select().from(users).orderBy(asc(users.name));
    },

    async findById(id: number) {
      const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return rows[0] ?? null;
    },
  };
}

export type UserRepository = ReturnType<typeof createUserRepository>;
