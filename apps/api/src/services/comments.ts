import type { Comment, CreateCommentInput } from '@tasklane/shared';
import { NotFoundError } from '../errors';
import { nowIso } from '../lib/time';
import type { CommentRecord, CommentRepository } from '../repositories/comments';
import type { IssueService } from './issues';
import type { UserService } from './users';

function toComment(record: CommentRecord): Comment {
  return {
    id: record.comment.id,
    body: record.comment.body,
    author: record.author,
    createdAt: record.comment.createdAt,
  };
}

interface CommentServiceDeps {
  comments: CommentRepository;
  issues: IssueService;
  users: UserService;
}

export function createCommentService({ comments, issues, users }: CommentServiceDeps) {
  return {
    async listForIssue(identifier: string): Promise<Comment[]> {
      const { issue } = await issues.findRecord(identifier);
      const records = await comments.listByIssue(issue.id);
      return records.map(toComment);
    },

    async create(identifier: string, input: CreateCommentInput, authorId: number): Promise<Comment> {
      const { issue } = await issues.findRecord(identifier);
      await users.assertExists(authorId);

      const id = await comments.insert({
        issueId: issue.id,
        authorId,
        body: input.body.trim(),
        createdAt: nowIso(),
      });
      const record = await comments.findById(id);
      if (!record) {
        throw new NotFoundError('Comment', id);
      }
      return toComment(record);
    },
  };
}

export type CommentService = ReturnType<typeof createCommentService>;
