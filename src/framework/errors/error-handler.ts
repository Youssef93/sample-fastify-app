import { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from 'src/framework/errors/error-factory';
import * as Logger from 'src/framework/logging/logger';

export const handleServerError = async (
  err: Error | AppError,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  if (err instanceof AppError && err.statusCode !== 500) {
    reply.status(err.statusCode).send({
      statusCode: err.statusCode,
      error: err.message,
      errorDetails: err.errorDetails,
    });
  } else {
    Logger.error({
      message: `Error ${err.message}`,
      serviceName: 'Error Handler',
    });

    reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
    });
  }
};
