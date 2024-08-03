import { AsyncLocalStorage } from 'async_hooks';
import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

export const addLocalStoreHook = (app: FastifyInstance): void => {
  app.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    const store = new Map<string, string>();

    const traceHeaderValue = request.headers['x-cloud-trace-context'] as string | undefined;
    const traceHeaderValueNoOptions = traceHeaderValue?.split(';')[0];

    const traceId = traceHeaderValueNoOptions?.split('/')[0];
    const spanId = traceHeaderValueNoOptions?.split('/')[1];

    const projectId = request.headers['x-goog-project-id'] as string | undefined;
    const requestMethod = request.method;
    const requestUrl = request.url;

    if (traceId) store.set('traceId', traceId);
    if (spanId) store.set('spanId', spanId);
    if (projectId) store.set('projectId', projectId);
    store.set('requestMethod', requestMethod);
    store.set('requestUrl', requestUrl);

    asyncLocalStorage.run(store, () => done());
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.addHook('onResponse', (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void => {
    asyncLocalStorage.exit(() => {});
  });
};
