/* eslint-disable @typescript-eslint/no-require-imports */
import { fastifyEnv } from '@fastify/env';
import { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import { EnvVariablesSchema } from 'src/framework/configurations/config.service';
import { addLocalStoreHook } from 'src/framework/logging/async-local-storage';
import { isLocalEnv } from 'src/framework/utils';
import { userRoutes } from 'src/modules/user/users.routes';

const allRoutes = [...userRoutes];

export const app = fastify();
addLocalStoreHook(app);

export const startServer = async (): Promise<FastifyInstance> => {
  await app.register(require('@fastify/swagger'), {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Test swagger',
        description: 'Testing the Fastify swagger API',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'x-api-key',
            in: 'header',
          },
        },
      },
    },
  });

  await app.register(require('@fastify/swagger-ui'), {
    routePrefix: '/swagger',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: true,
    },
    staticCSP: true,
    transformSpecificationClone: true,
  });

  app.register(fastifyEnv, {
    schema: EnvVariablesSchema,
    dotenv: isLocalEnv()
      ? {
          path: `.env.${process.env.NODE_ENV || 'local'}`,
        }
      : undefined,
  });

  allRoutes.forEach(route => {
    app[route.method](
      route.endpoint,
      {
        schema: route.schema,
        preHandler: route.middlewares,
      },
      route.controller,
    );
  });

  await app.ready();

  return app;
};
