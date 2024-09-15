/* eslint-disable @typescript-eslint/no-require-imports */
import fastify, { FastifyInstance } from 'fastify';
import { addLocalStoreHook } from 'src/framework/logging/async-local-storage';
import { userRoutes } from 'src/modules/user/users.routes';

export const app = fastify();

const allRoutes = [...userRoutes];

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
      deepLinking: false,
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

  await app.ready();

  return app;
};
