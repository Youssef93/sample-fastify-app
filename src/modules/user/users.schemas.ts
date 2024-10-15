import { Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
  name: Type.String({
    description: 'name description',
  }),
  mail: Type.Optional(Type.String({ format: 'email' })),
  age: Type.Optional(Type.Number({ default: 10 })),
});

export type UserType = Static<typeof UserSchema>;
