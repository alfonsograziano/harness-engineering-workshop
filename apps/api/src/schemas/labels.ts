import { LABEL_COLORS, MAX_LABEL_NAME_LENGTH } from '@tasklane/shared';
import { Type } from 'typebox';
import { ErrorResponseSchema } from './common';
import { ProjectKeyParamsSchema } from './projects';

export const LabelSchema = Type.Object({
  id: Type.Integer(),
  name: Type.String(),
  color: Type.Enum(LABEL_COLORS),
});

export const listLabelsSchema = {
  params: ProjectKeyParamsSchema,
  response: {
    200: Type.Array(LabelSchema),
    404: ErrorResponseSchema,
  },
};

export const createLabelSchema = {
  params: ProjectKeyParamsSchema,
  body: Type.Object(
    {
      name: Type.String({ minLength: 1, maxLength: MAX_LABEL_NAME_LENGTH }),
      color: Type.Enum(LABEL_COLORS),
    },
    { additionalProperties: false },
  ),
  response: {
    201: LabelSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
    409: ErrorResponseSchema,
  },
};
