// apps/api/src/schemas/milestones.ts

import { Type } from 'typebox';
import { ErrorResponseSchema, IsoDateSchema } from './common';
import { ProjectKeyParamsSchema } from './projects';

const MilestoneSchema = Type.Object({
  id: Type.Integer(),
  projectKey: Type.String(),
  name: Type.String(),
  dueDate: Type.Union([IsoDateSchema, Type.Null()]),
  createdAt: IsoDateSchema,
});

export const listMilestonesSchema = {
  params: ProjectKeyParamsSchema,
  response: {
    200: Type.Array(MilestoneSchema),
    404: ErrorResponseSchema,
  },
};

export const createMilestoneSchema = {
  params: ProjectKeyParamsSchema,
  body: Type.Object(
    {
      name: Type.String({ minLength: 1, maxLength: 100 }),
      dueDate: Type.Optional(Type.Union([IsoDateSchema, Type.Null()])),
    },
    { additionalProperties: false },
  ),
  response: {
    201: MilestoneSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
};
