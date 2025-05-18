import { Static, Type } from '@sinclair/typebox';
import { setDefaultsOnStaticSchema } from 'src/framework/utils';

export const UserSchema = Type.Object({
  name: Type.String({
    description: 'name description',
  }),
  mail: Type.Optional(Type.String({ format: 'email' })),
  age: Type.Optional(Type.Number({ default: 10 })),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const type = setDefaultsOnStaticSchema(UserSchema, ['age']);

export type UserType = Static<typeof type>;
