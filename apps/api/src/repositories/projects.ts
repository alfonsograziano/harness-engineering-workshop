import { asc, eq, sql } from 'drizzle-orm';
import type { Database } from '../db/client';
import { projects } from '../db/schema';

export function createProjectRepository(db: Database) {
  return {
    async list() {
      return db.select().from(projects).orderBy(asc(projects.id));
    },

    async findByKey(key: string) {
      const rows = await db.select().from(projects).where(eq(projects.key, key)).limit(1);
      return rows[0] ?? null;
    },

    /** Reserves the next issue number in a project. One statement, so two requests never get the same number. */
    async reserveIssueNumber(projectId: number) {
      const rows = await db
        .update(projects)
        .set({ issueCounter: sql`${projects.issueCounter} + 1` })
        .where(eq(projects.id, projectId))
        .returning({ issueCounter: projects.issueCounter });
      return rows[0].issueCounter;
    },
  };
}

export type ProjectRepository = ReturnType<typeof createProjectRepository>;
