import { FastifyInstance } from 'fastify';
import { startServer } from 'src/server';
import * as appRequest from 'supertest';
import TestAgent from 'supertest/lib/agent';

describe('Users Test', () => {
  let app: FastifyInstance;
  let request: TestAgent;

  beforeAll(async () => {
    app = await startServer();
    request = appRequest.default(app.server);
  });

  afterAll(() => {
    app.close();
  });

  describe('GET /users/test', () => {
    it('should successfully make the request', async () => {
      const response = await request.post('/users/test').send({ name: 'hello' });
      expect(response.status).toEqual(201);
    });
  });
});
