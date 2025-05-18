import { TObject } from '@sinclair/typebox';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

export enum IRouteMethod {
  get = 'get',
  put = 'put',
  delete = 'delete',
  post = 'post',
  patch = 'patch',
}

export interface IRouteValidationSchema {
  params?: TObject;
  body?: TObject;
  querystring?: TObject;
  response?: {
    200?: TObject;
    201?: TObject;
  };
  tags?: string[];
  summary?: string;
  security?: {
    [key in SWAGGER_SECURITIES]: [];
  }[];
}

export interface FastifyMiddleware {
  (request: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void): void | Promise<void>;
}

export enum SWAGGER_SECURITIES {
  API_KEY = 'apiKey',
}

export interface IAppRoute {
  method: IRouteMethod;
  controller: RouteHandlerMethod<
    Server<typeof IncomingMessage, typeof ServerResponse>,
    IncomingMessage,
    ServerResponse<IncomingMessage>
  >;
  endpoint: string;
  schema?: IRouteValidationSchema;
  middlewares?: FastifyMiddleware[];
}

type JSON = { [key: string]: JSON } | string | number | boolean | bigint | null | undefined | Array<JSON> | unknown;

export type OBJECT = {
  [key: string]: JSON;
};

export interface ILogDetails {
  message: string;
  serviceName: string;
  stackTrace?: string;
  additionalInfo?: OBJECT;
}
