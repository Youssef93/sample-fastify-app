import * as dotenv from 'dotenv';
import { isLocalEnv } from 'src/framework/utils';

const dotEnvConfig = { path: `.env.${process.env.NODE_ENV || 'local'}` };
if (isLocalEnv()) dotenv.config(dotEnvConfig);

import compression from '@fastify/compress';
import Cors from '@fastify/cors';
import { fastifyEnv } from '@fastify/env';
import helmet from '@fastify/helmet';
import multipart, { ajvFilePlugin } from '@fastify/multipart';
import Swagger from '@fastify/swagger';
import SwaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import { knexClient } from 'src/database/knexfile';
import { UserTypeEnumSchema } from 'src/entities/enums';
import { EnvVariablesSchema } from 'src/framework/configurations/config.service';
import { addLocalStoreHook } from 'src/framework/logging/async-local-storage';
import { userRoutes } from 'src/modules/user/users.routes';

const allRoutes = [...userRoutes];

const schemas = [UserTypeEnumSchema];

export const app = fastify({
  // Without trustProxy configured, Fastify would see the proxy's IP address as the client's IP and might not correctly interpret the original protocol.
  // Important if the app is deployed behind a load balancer like cloudrun
  trustProxy: true,
  ajv: {
    customOptions: {
      strict: true,
      strictRequired: true,
      removeAdditional: 'all',
      coerceTypes: false,
    },
    plugins: [ajvFilePlugin],
  },
});
addLocalStoreHook(app);

export const startServer = async (): Promise<FastifyInstance> => {
  app.register(helmet, {
    global: true,
  });

  for (const schema of schemas) {
    app.addSchema(schema);
  }

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

  await app.register(multipart, {
    attachFieldsToBody: false, // important, otherwise Fastify will buffer the entire file in memory
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit, adjust as needed
      files: 1,
    },
  });

  //@ts-expect-error: ref resolver
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
    refResolver: {
      buildLocalReference(json, baseUri, fragment, i) {
        // Return the $id directly if it exists
        /* istanbul ignore next */
        return json.$id || `def-${i}`;
      },
    },

    /* istanbul ignore next */
    transform({ schema, url, route }) {
      // @ts-expect-error: coming from additional types
      const overrideSwaggerSchema = schema.overrideSwaggerSchemaInput as ISwaggerSchemaInput | undefined;

      // Override swagger with another schema
      // Useful if our input is different from the validation layer
      // Example: Multipart file uploads are automatically parsed. So the swagger input is different that what goes in the validation hook
      if (overrideSwaggerSchema?.body) schema.body = overrideSwaggerSchema.body;
      if (overrideSwaggerSchema?.params) schema.params = overrideSwaggerSchema.params;
      if (overrideSwaggerSchema?.querystring) schema.querystring = overrideSwaggerSchema.querystring;

      // @ts-expect-error: coming from additional types
      delete schema.overrideSwaggerSchemaInput;

      return {
        schema,
        url,
        route,
      };
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
        preValidation: route.preValidationHandlers,
      },
      route.controller,
    );
  });

  await knexClient.migrate.latest();

  await app.ready();

  return app;
};
