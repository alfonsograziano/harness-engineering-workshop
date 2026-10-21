// apps/api/src/repositories/milestones.ts

import { asc, eq } from 'drizzle-orm';
import type { Database } from '../db/client';
import { milestones } from '../db/schema';

export type MilestoneRow = typeof milestones.$inferSelect;

export function createMilestoneRepository(db: Database) {
  return {
    async listByProject(projectId: number) {
      return db.select().from(milestones).where(eq(milestones.projectId, projectId)).orderBy(asc(milestones.name));
    },

    async findById(id: number) {
      const rows = await db.select().from(milestones).where(eq(milestones.id, id)).limit(1);
      return rows[0] ?? null;
    },

    async insert(values: typeof milestones.$inferInsert) {
      const rows = await db.insert(milestones).values(values).returning({ id: milestones.id });
      return rows[0].id;
    },
  };
}

export type MilestoneRepository = ReturnType<typeof createMilestoneRepository>;
