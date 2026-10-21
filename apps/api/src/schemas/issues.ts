import { MAX_LABELS_PER_ISSUE } from '@tasklane/shared';
import { Type } from 'typebox';
import { ErrorResponseSchema, IsoDateSchema, IssuePrioritySchema, IssueStatusSchema } from './common';
import { LabelSchema } from './labels';
import { ProjectKeyParamsSchema } from './projects';
import { UserSchema } from './users';

const IssueSchema = Type.Object({
  id: Type.Integer(),
  identifier: Type.String(),
  projectKey: Type.String(),
  number: Type.Integer(),
  title: Type.String(),
  description: Type.String(),
  status: IssueStatusSchema,
  priority: IssuePrioritySchema,
  assignee: Type.Union([UserSchema, Type.Null()]),
  creator: UserSchema,
  labels: Type.Array(LabelSchema),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema,
});

export const IssueIdentifierParamsSchema = Type.Object({
  identifier: Type.String({ pattern: '^[A-Z][A-Z0-9]*-[0-9]+$' }),
});

export const listProjectIssuesSchema = {
  params: ProjectKeyParamsSchema,
  querystring: Type.Object({
    status: Type.Optional(IssueStatusSchema),
    assigneeId: Type.Optional(Type.Integer({ minimum: 1 })),
    labelId: Type.Optional(Type.Integer({ minimum: 1 })),
  }),
  response: {
    200: Type.Array(IssueSchema),
    404: ErrorResponseSchema,
  },
};

export const createIssueSchema = {
  params: ProjectKeyParamsSchema,
  body: Type.Object(
    {
      title: Type.String({ minLength: 1, maxLength: 200 }),
      description: Type.Optional(Type.String({ maxLength: 10_000 })),
      status: Type.Optional(IssueStatusSchema),
      priority: Type.Optional(IssuePrioritySchema),
      assigneeId: Type.Optional(Type.Union([Type.Integer({ minimum: 1 }), Type.Null()])),
    },
    { additionalProperties: false },
  ),
  response: {
    201: IssueSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
};

export const getIssueSchema = {
  params: IssueIdentifierParamsSchema,
  response: {
    200: IssueSchema,
    404: ErrorResponseSchema,
  },
};

export const updateIssueSchema = {
  params: IssueIdentifierParamsSchema,
  body: Type.Object(
    {
      title: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
      description: Type.Optional(Type.String({ maxLength: 10_000 })),
      status: Type.Optional(IssueStatusSchema),
      priority: Type.Optional(IssuePrioritySchema),
      assigneeId: Type.Optional(Type.Union([Type.Integer({ minimum: 1 }), Type.Null()])),
    },
    { additionalProperties: false, minProperties: 1 },
  ),
  response: {
    200: IssueSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
};

export const setIssueLabelsSchema = {
  params: IssueIdentifierParamsSchema,
  body: Type.Object(
    {
      labelIds: Type.Array(Type.Integer({ minimum: 1 }), { maxItems: MAX_LABELS_PER_ISSUE }),
    },
    { additionalProperties: false },
  ),
  response: {
    200: IssueSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
};
