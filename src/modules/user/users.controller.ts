import { FastifyReply, FastifyRequest } from 'fastify';
import * as Logger from 'src/framework/logging/logger';
import { UserType } from 'src/modules/user/users.schemas';

export const getUser = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const body = request.body as UserType;

  Logger.log({
    message: JSON.stringify(body),
    serviceName: 'Controller',
  });

  reply.code(201).send(body);
};
