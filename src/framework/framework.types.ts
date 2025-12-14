import { Static, TAnySchema, Type } from '@sinclair/typebox';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { FastifySchemaValidationError } from 'fastify/types/schema';
import { IncomingMessage, Server, ServerResponse } from 'http';

export enum IRouteMethod {
  get = 'get',
  put = 'put',
  delete = 'delete',
  post = 'post',
  patch = 'patch',
}

export interface ISwaggerSchemaInput {
  params?: TAnySchema;
  body?: TAnySchema;
  querystring?: TAnySchema;
}

export interface IRouteValidationSchema extends ISwaggerSchemaInput {
  response: { 200: TAnySchema; 201?: never } | { 200?: never; 201: TAnySchema };
  tags?: string[];
  summary?: string;
  security?: SecurityEntry[];
  consumes?: string[];
  overrideSwaggerSchemaInput?: ISwaggerSchemaInput;
}

export interface FastifyMiddleware {
  (request: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void): void | Promise<void>;
}

export enum SWAGGER_SECURITIES {
  API_KEY = 'apiKey',
}

type SecurityEntry = {
  [key in SWAGGER_SECURITIES]?: [];
};

type FastifyHandler = RouteHandlerMethod<
  Server<typeof IncomingMessage, typeof ServerResponse>,
  IncomingMessage,
  ServerResponse<IncomingMessage>
>;

export interface IAppRoute {
  method: IRouteMethod;
  controller: FastifyHandler;
  endpoint: string;
  schema: IRouteValidationSchema;
  swaggerSchema?: IRouteValidationSchema;
  middlewares?: FastifyMiddleware[];
  preValidationHandlers?: FastifyHandler[];
  version?: string;
}

type JSON =
  | { [key: string]: JSON }
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined
  | Array<JSON>
  | FastifySchemaValidationError;

export type OBJECT = {
  [key: string]: JSON;
};

export interface ILogDetails {
  message: string;
  serviceName: string;
  stackTrace?: string;
  additionalInfo?: OBJECT;
}

export const StandardResultSchema = Type.Object({
  result: Type.Boolean({
    description: 'The success of the operation',
    examples: [true],
  }),
});

export type StandardResultSType = Static<typeof StandardResultSchema>;

export type OptionalToNullable<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]: T[K] | null; // Only optional keys get | null
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K]; // Preserve non-optional keys
};

export type NullableToOptional<T> = {
  [K in keyof T as null extends T[K] ? K : never]?: Exclude<T[K], null>; // Optional if nullable
} & {
  [K in keyof T as null extends T[K] ? never : K]: T[K]; // Required if not nullable
};

export type StringToNumber<T, Keys extends keyof T> = {
  [K in keyof T]: K extends Keys
    ? T[K] extends string | null | undefined
      ? T[K] extends null
        ? T[K] extends undefined
          ? number | null | undefined
          : number | null
        : T[K] extends undefined
          ? number | undefined
          : number
      : T[K]
    : T[K];
};

export type UndefinedOrNullToFixed<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>;
};

export type PartialByKeys<T, K extends keyof T = keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const ErrorSchema = Type.Object({
  statusCode: Type.Number({
    description: 'HTTP error status code',
  }),

  error: Type.String({
    description: 'Error Message',
  }),

  errorDetails: Type.Optional(
    Type.Object({
      errorCode: Type.Optional(
        Type.String({
          description: 'Custom error code return by backend',
        }),
      ),
    }),
  ),
});

export type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U>
    ? `${Lowercase<T>}${CamelToSnake<U>}`
    : `${Lowercase<T>}_${CamelToSnake<Uncapitalize<U>>}`
  : S;

export type KeysToSnakeCase<T> = {
  [K in keyof T as K extends string ? CamelToSnake<K> : K]: T[K] extends Array<infer U>
    ? KeysToSnakeCase<U>[]
    : T[K] extends object
      ? KeysToSnakeCase<T[K]>
      : T[K];
};
