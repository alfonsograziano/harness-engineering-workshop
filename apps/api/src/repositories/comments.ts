import { asc, eq } from 'drizzle-orm';
import type { Database } from '../db/client';
import { comments, users } from '../db/schema';

const commentWithAuthor = {
  comment: comments,
  author: { id: users.id, name: users.name, email: users.email },
};

export function createCommentRepository(db: Database) {
  return {
    async listByIssue(issueId: number) {
      return db
        .select(commentWithAuthor)
        .from(comments)
        .innerJoin(users, eq(comments.authorId, users.id))
        .where(eq(comments.issueId, issueId))
        .orderBy(asc(comments.createdAt), asc(comments.id));
    },

    async findById(id: number) {
      const rows = await db
        .select(commentWithAuthor)
        .from(comments)
        .innerJoin(users, eq(comments.authorId, users.id))
        .where(eq(comments.id, id))
        .limit(1);
      return rows[0] ?? null;
    },

    async insert(values: typeof comments.$inferInsert) {
      const rows = await db.insert(comments).values(values).returning({ id: comments.id });
      return rows[0].id;
    },
  };
}

export type CommentRepository = ReturnType<typeof createCommentRepository>;
export type CommentRecord = NonNullable<Awaited<ReturnType<CommentRepository['findById']>>>;
