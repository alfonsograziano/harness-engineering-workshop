// apps/api/src/db/schema.ts — add the table, then run `npm run db:generate` from the root.

export const milestones = sqliteTable('milestones', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id),
  name: text('name').notNull(),
  dueDate: text('due_date'),
  createdAt: text('created_at').notNull(),
});
