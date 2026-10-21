import { and, asc, eq, inArray, sql } from 'drizzle-orm';
import type { Database } from '../db/client';
import { singleRow } from '../db/rows';
import { issueLabels, labels } from '../db/schema';

export type LabelRow = typeof labels.$inferSelect;

const byName = asc(sql`lower(${labels.name})`);

export function createLabelRepository(db: Database) {
  return {
    async listByProject(projectId: number) {
      return db.select().from(labels).where(eq(labels.projectId, projectId)).orderBy(byName);
    },

    async findById(id: number) {
      const rows = await db.select().from(labels).where(eq(labels.id, id)).limit(1);
      return rows[0] ?? null;
    },

    async findByIds(ids: number[]) {
      if (ids.length === 0) {
        return [];
      }
      return db.select().from(labels).where(inArray(labels.id, ids));
    },

    /** Case-insensitive, because "Bug" and "bug" are the same label. */
    async findByProjectAndName(projectId: number, name: string) {
      const rows = await db
        .select()
        .from(labels)
        .where(and(eq(labels.projectId, projectId), eq(sql`lower(${labels.name})`, name.toLowerCase())))
        .limit(1);
      return rows[0] ?? null;
    },

    async insert(values: typeof labels.$inferInsert) {
      return singleRow(await db.insert(labels).values(values).returning({ id: labels.id })).id;
    },

    /** The labels of many issues in one query, sorted by name. */
    async listForIssues(issueIds: number[]) {
      if (issueIds.length === 0) {
        return [];
      }
      return db
        .select({ issueId: issueLabels.issueId, label: labels })
        .from(issueLabels)
        .innerJoin(labels, eq(issueLabels.labelId, labels.id))
        .where(inArray(issueLabels.issueId, issueIds))
        .orderBy(byName);
    },

    /** Replaces the whole set of labels on an issue. */
    async replaceIssueLabels(issueId: number, labelIds: number[]) {
      await db.transaction(async (tx) => {
        await tx.delete(issueLabels).where(eq(issueLabels.issueId, issueId));
        if (labelIds.length > 0) {
          await tx.insert(issueLabels).values(labelIds.map((labelId) => ({ issueId, labelId })));
        }
      });
    },
  };
}

export type LabelRepository = ReturnType<typeof createLabelRepository>;
