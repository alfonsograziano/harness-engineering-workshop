import { ISSUE_PRIORITIES, ISSUE_STATUSES } from '@tasklane/shared';
import { Type } from 'typebox';

/** An ISO 8601 timestamp in UTC. */
export const IsoDateSchema = Type.String({ description: 'ISO 8601 timestamp in UTC' });

export const IssueStatusSchema = Type.Enum(ISSUE_STATUSES);
export const IssuePrioritySchema = Type.Enum(ISSUE_PRIORITIES);

export const ErrorResponseSchema = Type.Object({
  error: Type.Object({
    code: Type.String(),
    message: Type.String(),
    details: Type.Optional(Type.Unknown()),
  }),
});
