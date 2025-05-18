import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from 'src/framework/errors/error-factory';
import * as Logger from 'src/framework/logging/logger';

export const handleServerError = async (
  err: FastifyError | Error | AppError,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  // @ts-expect-error: check err code in case of ajv error
  if (err.code === 'FST_ERR_VALIDATION') {
    const fastifyError = err as FastifyError;

    // Do not log validation error message on production
    const message = process.env.NODE_ENV === 'production' ? 'Bad Request Error' : err.message;

    Logger.warn({
      message,
      serviceName: 'Error Handler',
      additionalInfo: {
        validation: fastifyError.validation,
      },
    });

    reply.status(400).send({
      statusCode: 400,
      error: err.message,
    });
  } else if (err instanceof AppError && err.statusCode !== 500) {
    Logger.warn({
      message: err.message,
      serviceName: 'Error Handler',
      stackTrace: err.stack || 'true', // ensure stack trace is logged to trigger an error report in GCP
    });

    reply.status(err.statusCode).send({
      statusCode: err.statusCode,
      error: err.message,
      errorDetails: err.errorDetails,
    });
  } else {
    Logger.error({
      message: `Error ${err.message}`,
      serviceName: 'Error Handler',
      stackTrace: err.stack || 'true', // ensure stack trace is logged to trigger an error report in GCP
    });

    reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
    });
  }
};
