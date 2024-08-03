import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export const ApiKeyMiddleware = (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void => {
  // if(!request.headers['x-api-key']) throw new  AppError(401, 'Missing Api Key')
  done();
};
