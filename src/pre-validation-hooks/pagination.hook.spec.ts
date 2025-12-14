import { FastifyReply, FastifyRequest } from 'fastify';
import { getMockedLogger } from 'src/framework/test-utils';

jest.mock('../framework/logging/logger.ts', () => {
  return getMockedLogger();
});

import { ParsePaginationHook } from 'src/pre-validation-hooks/pagination.hook';

describe('ParsePaginationHook', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockRequest = {};

    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it('should succeed if tokenInfo is valid', async () => {
    mockRequest.query = {
      page: '2',
      limit: '50',
    };
    await ParsePaginationHook(mockRequest as FastifyRequest, mockReply as FastifyReply);
    expect(mockRequest.query).toStrictEqual({ page: 2, limit: 50 });
  });

  it('sets default values if query is not provided', async () => {
    mockRequest.query = {};
    await ParsePaginationHook(mockRequest as FastifyRequest, mockReply as FastifyReply);
    expect(mockRequest.query).toStrictEqual({ page: 1, limit: 50 });
  });
});
