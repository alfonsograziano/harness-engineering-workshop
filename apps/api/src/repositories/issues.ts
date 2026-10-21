import { and, desc, eq, inArray, type SQL } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import type { IssueStatus } from '@tasklane/shared';
import type { Database } from '../db/client';
import { singleRow } from '../db/rows';
import { issueLabels, issues, projects, users } from '../db/schema';

const assignee = alias(users, 'assignee');
const creator = alias(users, 'creator');

const issueWithPeople = {
  issue: issues,
  projectKey: projects.key,
  assignee: { id: assignee.id, name: assignee.name, email: assignee.email },
  creator: { id: creator.id, name: creator.name, email: creator.email },
};

export type IssueRow = typeof issues.$inferSelect;
export type NewIssueRow = typeof issues.$inferInsert;

export interface IssueFilters {
  status?: IssueStatus;
  assigneeId?: number;
  labelId?: number;
}

export function createIssueRepository(db: Database) {
  function selectIssues() {
    return db
      .select(issueWithPeople)
      .from(issues)
      .innerJoin(projects, eq(issues.projectId, projects.id))
      .innerJoin(creator, eq(issues.creatorId, creator.id))
      .leftJoin(assignee, eq(issues.assigneeId, assignee.id));
  }

  return {
    async listByProject(projectId: number, filters: IssueFilters = {}) {
      const conditions: SQL[] = [eq(issues.projectId, projectId)];
      if (filters.status) {
        conditions.push(eq(issues.status, filters.status));
      }
      if (filters.assigneeId) {
        conditions.push(eq(issues.assigneeId, filters.assigneeId));
      }
      if (filters.labelId) {
        const labelled = db
          .select({ issueId: issueLabels.issueId })
          .from(issueLabels)
          .where(eq(issueLabels.labelId, filters.labelId));
        conditions.push(inArray(issues.id, labelled));
      }
      return selectIssues()
        .where(and(...conditions))
        .orderBy(desc(issues.updatedAt));
    },

    async findById(id: number) {
      const rows = await selectIssues().where(eq(issues.id, id)).limit(1);
      return rows[0] ?? null;
    },

    async findByProjectAndNumber(projectId: number, issueNumber: number) {
      const rows = await selectIssues()
        .where(and(eq(issues.projectId, projectId), eq(issues.number, issueNumber)))
        .limit(1);
      return rows[0] ?? null;
    },

    async insert(values: NewIssueRow) {
      return singleRow(await db.insert(issues).values(values).returning({ id: issues.id })).id;
    },

    async update(id: number, values: Partial<NewIssueRow>) {
      await db.update(issues).set(values).where(eq(issues.id, id));
    },
  };
}

export type IssueRepository = ReturnType<typeof createIssueRepository>;
export type IssueRecord = NonNullable<Awaited<ReturnType<IssueRepository['findById']>>>;
