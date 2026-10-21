import { Type } from 'typebox';
import { ErrorResponseSchema, IsoDateSchema } from './common';
import { IssueIdentifierParamsSchema } from './issues';
import { UserSchema } from './users';

export const CommentSchema = Type.Object({
  id: Type.Integer(),
  body: Type.String(),
  author: UserSchema,
  createdAt: IsoDateSchema,
});

export const listCommentsSchema = {
  params: IssueIdentifierParamsSchema,
  response: {
    200: Type.Array(CommentSchema),
    404: ErrorResponseSchema,
  },
};

export const createCommentSchema = {
  params: IssueIdentifierParamsSchema,
  body: Type.Object(
    {
      body: Type.String({ minLength: 1, maxLength: 10_000 }),
    },
    { additionalProperties: false },
  ),
  response: {
    201: CommentSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
};
