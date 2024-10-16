import { Static, Type } from '@sinclair/typebox';
import { app } from 'src/server';

declare module 'fastify' {
  interface FastifyInstance {
    config: Static<typeof EnvVariablesSchema>;
  }
}

export const EnvVariablesSchema = Type.Object({
  PORT: Type.Optional(Type.Number()),
  DATABASE_URL: Type.String({}),
  NODE_ENV: Type.Optional(Type.String({})),
  GCP_PROJECT_ID: Type.Optional(Type.String({})),
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getConfig = () => {
  const envVariables = app.config;

  return {
    database: {
      url: envVariables.DATABASE_URL,
    },
    server: {
      port: envVariables.PORT || 3000,
      nodeEnv: envVariables.NODE_ENV || 'local',
    },
    gcp: {
      projectId: envVariables.GCP_PROJECT_ID,
    },
  };
};
