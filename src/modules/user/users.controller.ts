import { FastifyReply, FastifyRequest } from 'fastify';
import * as Logger from 'src/framework/logging/logger';
import { UserType } from 'src/entities/users.entities';

export const getUser = async (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
  const body = request.body as UserType;

  Logger.log({
    message: JSON.stringify(body),
    serviceName: 'Controller',
  });

  reply.code(201).send(body);
  return reply;
};
