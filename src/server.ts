import * as dotenv from 'dotenv';
import { isLocalEnv } from 'src/framework/utils';

const dotEnvConfig = { path: `.env.${process.env.NODE_ENV || 'local'}` };
if (isLocalEnv()) dotenv.config(dotEnvConfig);

import compression from '@fastify/compress';
import Cors from '@fastify/cors';
import { fastifyEnv } from '@fastify/env';
import helmet from '@fastify/helmet';
import Swagger from '@fastify/swagger';
import SwaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import { knexClient } from 'src/database/knexfile';
import { EnvVariablesSchema } from 'src/framework/configurations/config.service';
import { addLocalStoreHook } from 'src/framework/logging/async-local-storage';
import { userRoutes } from 'src/modules/user/users.routes';

const allRoutes = [...userRoutes];

export const app = fastify({
  ajv: {
    customOptions: {
      strict: true,
      strictRequired: true,
      removeAdditional: 'all',
    },
  },
});
addLocalStoreHook(app);

export const startServer = async (): Promise<FastifyInstance> => {
  app.register(helmet, {
    global: true,
  });

  // Disable compression in test environment
  if (process.env.NODE_ENV !== 'test') {
    /* istanbul ignore next */
    app.register(compression, {
      global: true,
      encodings: ['gzip', 'deflate'],
    });
  }

  app.register(fastifyEnv, {
    schema: EnvVariablesSchema,
    dotenv: isLocalEnv() ? dotEnvConfig : undefined,
  });

  app.register(Cors, {
    origin: process.env.CORS_DOMAINS?.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['*'],
  });

  await app.register(Swagger, {
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

  await app.register(SwaggerUi, {
    routePrefix: '/swagger',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: true,
    },
    staticCSP: true,
    transformSpecificationClone: true,
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

  await knexClient.migrate.latest();

  await app.ready();

  return app;
};
