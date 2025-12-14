import { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequestError } from 'src/framework/errors/error-factory';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function MultipartHook(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!req.isMultipart()) {
    throw new BadRequestError('Request must be multipart');
  }

  await req.saveRequestFiles();
  req.body = req.savedRequestFiles;
}
