import { IAppRoute, IRouteMethod } from 'src/framework/framework.types';
import { ApiKeyMiddleware } from 'src/middlewares/apikey.middleware';
import { getUser } from 'src/modules/user/users.controller';
import { UserSchema } from 'src/modules/user/users.schemas';

export const userRoutes: IAppRoute[] = [
  {
    controller: getUser,
    endpoint: '/users/:userId',
    method: IRouteMethod.post,
    schema: {
      body: UserSchema,
      response: {
        201: UserSchema,
      },
      tags: ['users'],
      summary: 'User endpoint',
      security: [{ apiKey: [] }],
    },
    middlewares: [ApiKeyMiddleware],
  },
];
