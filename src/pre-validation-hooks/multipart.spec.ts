import { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequestError } from 'src/framework/errors/error-factory';
import { getMockedLogger } from 'src/framework/test-utils';

const mockIsMultiPart = jest.fn();
const mockSaveRequestFiles = jest.fn();

jest.mock('../framework/logging/logger.ts', () => {
  return getMockedLogger();
});

import { MultipartHook } from 'src/pre-validation-hooks/multipart.hook';

describe('MultipartHook', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  const mockedMultiPartFile = {
    filename: 'test',
    filepath: 'test',
    fieldname: 'test',
    encoding: 'test',
    mimetype: 'test',
  };

  beforeEach(() => {
    mockRequest = {
      isMultipart: mockIsMultiPart,
      saveRequestFiles: mockSaveRequestFiles,
      // @ts-expect-error: mock multipart
      savedRequestFiles: [mockedMultiPartFile],
    };

    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    mockIsMultiPart.mockReset();
    mockSaveRequestFiles.mockReset();
  });

  it('should succeed if tokenInfo is valid', async () => {
    mockIsMultiPart.mockReturnValue(true);
    await MultipartHook(mockRequest as FastifyRequest, mockReply as FastifyReply);
    expect(mockRequest.body).toStrictEqual([mockedMultiPartFile]);
  });

  it('should throws 500 if request is not multipart', async () => {
    mockIsMultiPart.mockReturnValue(false);
    const responsePromise = MultipartHook(mockRequest as FastifyRequest, mockReply as FastifyReply);
    expect(responsePromise).rejects.toBeInstanceOf(BadRequestError);
    try {
      await responsePromise;
    } catch (e) {
      expect((e as Error)?.message).toStrictEqual('Request must be multipart');
    }
  });
});
