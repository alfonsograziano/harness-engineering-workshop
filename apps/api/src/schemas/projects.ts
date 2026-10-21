import { Type } from 'typebox';
import { ErrorResponseSchema, IsoDateSchema } from './common';

export const ProjectSchema = Type.Object({
  id: Type.Integer(),
  key: Type.String(),
  name: Type.String(),
  description: Type.String(),
  createdAt: IsoDateSchema,
});

export const ProjectKeyParamsSchema = Type.Object({
  key: Type.String({ pattern: '^[A-Z][A-Z0-9]*$' }),
});

export const listProjectsSchema = {
  response: {
    200: Type.Array(ProjectSchema),
  },
};

export const getProjectSchema = {
  params: ProjectKeyParamsSchema,
  response: {
    200: ProjectSchema,
    404: ErrorResponseSchema,
  },
};
