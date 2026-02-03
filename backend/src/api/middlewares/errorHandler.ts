import type { NextFunction, Request, Response } from 'express';

import type { Reporter } from '../../lib/errorReporter/index.js';

import {
  APIError,
  BadRequest,
  Forbidden,
  InternalServerError,
  MethodNotAllowed,
  NotFound,
  RangeNotSatisfiable,
  Unauthorized,
  UnsupportedMediaType
} from '../errors/index.js';

type ErrorWithStatus = Error & { status: number };

const STATUS_CODE_TO_HTTP_ERROR_MAP: Record<number, APIError> = {
  400: new BadRequest(),
  401: new Unauthorized(),
  403: new Forbidden(),
  404: new NotFound(),
  405: new MethodNotAllowed(),
  415: new UnsupportedMediaType(),
  416: new RangeNotSatisfiable(),
  500: new InternalServerError()
};

function hasStatus(error: Error | ErrorWithStatus): error is ErrorWithStatus {
  return (error as ErrorWithStatus).status !== undefined;
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  const errorReporter = req.app.get('errorReporter') as Reporter;

  if (error instanceof APIError) {
    res
      .status(error.httpStatusCode)
      .send({ code: error.code });
  } else if (hasStatus(error)) {
    // These errors are throw by express-openapi-validator dependency so we need to map them
    // into errors in the standard format
    const httpError = STATUS_CODE_TO_HTTP_ERROR_MAP[error.status];

    // all 500 errors should be reported
    if (error.status === 500) {
      errorReporter.send(error);
    }

    if (httpError) {
      res
        .status(httpError.httpStatusCode)
        .send({ code: httpError.code });
    } else {
      // any unmapped error should be reported, the conditional is because all 500 errors are
      // reported somewhere else (above)
      if (error.status !== 500) {
        errorReporter.send(error);
      }

      res
        .status(error.status)
        .send({ code: 'UNKNOWN_ERROR_CODE' });
    }
  } else {
    const httpError = STATUS_CODE_TO_HTTP_ERROR_MAP[500];

    errorReporter.send(error);

    res
      .status(httpError.httpStatusCode)
      .send({ code: httpError.code });
  }
};

export default errorHandler;
