import type { ApiErrorResponse } from '@tasklane/shared';
import type { FastifyError, FastifyInstance } from 'fastify';

/**
 * An error we expect and know how to describe to the client.
 * Services throw these; the central error handler turns them into the shared error format.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string | number) {
    super(404, 'NOT_FOUND', `${resource} ${id} was not found`);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, 'BAD_REQUEST', message, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}

function errorBody(code: string, message: string, details?: unknown): ApiErrorResponse {
  return details === undefined ? { error: { code, message } } : { error: { code, message, details } };
}

/** Sends every error in the same `{ error: { code, message, details? } }` shape. */
export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(errorBody(error.code, error.message, error.details));
    }

    if (error.validation) {
      return reply.status(400).send(errorBody('VALIDATION_ERROR', error.message, error.validation));
    }

    if (error.statusCode && error.statusCode < 500) {
      return reply.status(error.statusCode).send(errorBody(error.code ?? 'BAD_REQUEST', error.message));
    }

    request.log.error(error);
    return reply.status(500).send(errorBody('INTERNAL_ERROR', 'Something went wrong on our side'));
  });

  app.setNotFoundHandler((request, reply) => {
    return reply
      .status(404)
      .send(errorBody('ROUTE_NOT_FOUND', `Route ${request.method} ${request.url} does not exist`));
  });
}
