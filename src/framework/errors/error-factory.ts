export interface IErrorDetails {
  errorCode?: string;
}

// A built in Error class that will automatically be checked for in error handler middleware
export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorDetails?: IErrorDetails;

  constructor(statusCode: number, message: string, errorDetails?: IErrorDetails) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, errorDetails?: IErrorDetails) {
    super(400, message, errorDetails);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string, errorDetails?: IErrorDetails) {
    super(500, message, errorDetails);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, errorDetails?: IErrorDetails) {
    super(404, message, errorDetails);
  }
}
