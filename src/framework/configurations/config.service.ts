import { app } from 'src/server';

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
  };
};
