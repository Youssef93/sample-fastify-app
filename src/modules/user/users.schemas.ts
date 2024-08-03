import { Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
  name: Type.String({
    description: 'name description',
  }),
  mail: Type.Optional(Type.String({ format: 'email' })),
});

export type UserType = Static<typeof UserSchema>;
