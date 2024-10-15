import { Static, Type } from '@sinclair/typebox';

export const EnvVariablesSchema = Type.Object({
  PORT: Type.Optional(Type.Number()),
  DATABASE_URL: Type.String({}),
  NODE_ENV: Type.Optional(Type.String({})),
});

declare module 'fastify' {
  interface FastifyInstance {
    config: Static<typeof EnvVariablesSchema>;
  }
}
