import { Type } from 'typebox';

export const UserSchema = Type.Object({
  id: Type.Integer(),
  name: Type.String(),
  email: Type.String(),
});

export const listUsersSchema = {
  response: {
    200: Type.Array(UserSchema),
  },
};
