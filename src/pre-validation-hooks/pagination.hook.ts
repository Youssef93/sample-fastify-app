import { FastifyReply, FastifyRequest } from 'fastify';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function ParsePaginationHook(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  // @ts-expect-error: pagination query
  req.query.page = req.query?.page ? parseInt(req.query.page as string) : 1;
  // @ts-expect-error: pagination query
  req.query.limit = req.query?.limit ? parseInt(req.query.limit as string) : 50;
}
