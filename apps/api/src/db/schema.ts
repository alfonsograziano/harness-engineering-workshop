import { ISSUE_PRIORITIES, ISSUE_STATUSES } from '@tasklane/shared';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

// Timestamps are stored as ISO 8601 strings in UTC. See src/lib/time.ts.

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  // The last issue number handed out in this project. WEB-12 means issueCounter reached 12.
  issueCounter: integer('issue_counter').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

export const issues = sqliteTable(
  'issues',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id),
    number: integer('number').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    status: text('status', { enum: ISSUE_STATUSES }).notNull().default('backlog'),
    priority: text('priority', { enum: ISSUE_PRIORITIES }).notNull().default('none'),
    assigneeId: integer('assignee_id').references(() => users.id),
    creatorId: integer('creator_id')
      .notNull()
      .references(() => users.id),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [uniqueIndex('issues_project_number_unique').on(table.projectId, table.number)],
);

export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  issueId: integer('issue_id')
    .notNull()
    .references(() => issues.id, { onDelete: 'cascade' }),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id),
  body: text('body').notNull(),
  createdAt: text('created_at').notNull(),
});
