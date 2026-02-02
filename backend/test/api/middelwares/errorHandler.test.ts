import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import type { Application, Request, Response } from 'express';

import errorHandler from '../../../src/api/middlewares/errorHandler.js';
import { MemoryReporter } from '../../../src/lib/errorReporter/index.js';
import {
  BadRequest,
  Conflict,
  InternalServerError,
  MethodNotAllowed,
  NotFound,
  RangeNotSatisfiable,
  Unauthorized,
  UnsupportedMediaType
} from '../../../src/api/errors/index.js';

class TestServer {
  private app: Application;
  private errorReporter: MemoryReporter;
  private errorToThrow: Error | null = null;

  constructor() {
    this.app = express();

    this.app.get('/test', (_req: Request, res: Response) => {
      if (this.errorToThrow) {
        throw this.errorToThrow;
      } else {
        res.send({ message: 'OK' });
      }
    });

    this.errorReporter = new MemoryReporter();

    this.app.set('errorReporter', this.errorReporter);
    this.app.use(errorHandler);
  }

  getExpressApp(): Application {
    return this.app;
  }

  getErrorReporter(): MemoryReporter {
    return this.errorReporter;
  }

  setErrorToThrow(error: Error) {
    this.errorToThrow = error;
  }
}

describe('errorHandler', () => {
  let server: TestServer;

  beforeEach(() => {
    server = new TestServer();
  });

  it('should return a message OK when an error is not sent', async () => {
    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal({ message: 'OK' });
  });

  it('should return a default message with a bad request error', async () => {
    server.setErrorToThrow(new BadRequest());

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal({ code: 'BAD_REQUEST' });
  });

  it('should return a custom message with a bad request error', async () => {
    server.setErrorToThrow(new BadRequest('CUSTOM_MESSAGE'));

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal({ code: 'CUSTOM_MESSAGE' });
  });

  it('should return a default message with an unauthorized error', async () => {
    server.setErrorToThrow(new Unauthorized());

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ code: 'UNAUTHORIZED' });
  });

  it('should return a custom message with an unauthorized error', async () => {
    server.setErrorToThrow(new Unauthorized('CUSTOM_MESSAGE'));

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ code: 'CUSTOM_MESSAGE' });
  });

  it('should return a custom message with a not found error', async () => {
    server.setErrorToThrow(new NotFound('CUSTOM_MESSAGE'));

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(404);
    expect(response.body).to.be.deep.equal({ code: 'CUSTOM_MESSAGE' });
  });

  it('should return a default message with a not found error', async () => {
    server.setErrorToThrow(new NotFound());

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(404);
    expect(response.body).to.be.deep.equal({ code: 'NOT_FOUND' });
  });

  it('should return a custom message with a method not allowed error', async () => {
    server.setErrorToThrow(new MethodNotAllowed('CUSTOM_MESSAGE'));

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(405);
    expect(response.body).to.be.deep.equal({ code: 'CUSTOM_MESSAGE' });
  });

  it('should return a default message with a method not allowed error', async () => {
    server.setErrorToThrow(new MethodNotAllowed());

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(405);
    expect(response.body).to.be.deep.equal({ code: 'METHOD_NOT_ALLOWED' });
  });

  it('should return a custom message with a method conflict error', async () => {
    server.setErrorToThrow(new Conflict('CUSTOM_MESSAGE'));

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(409);
    expect(response.body).to.be.deep.equal({ code: 'CUSTOM_MESSAGE' });
  });

  it('should return a default message with a method conflict error', async () => {
    server.setErrorToThrow(new Conflict());

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(409);
    expect(response.body).to.be.deep.equal({ code: 'CONFLICT' });
  });

  it('should return a default message error with an unsupported media type error', async () => {
    server.setErrorToThrow(new UnsupportedMediaType());

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(415);
    expect(response.body).to.be.deep.equal({ code: 'UNSUPPORTED_MEDIA_TYPE' });
  });

  it('should return a custom message with an unsupported media type error', async () => {
    server.setErrorToThrow(new UnsupportedMediaType('CUSTOM_MESSAGE'));

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(415);
    expect(response.body).to.be.deep.equal({ code: 'CUSTOM_MESSAGE' });
  });

  it('should return a default message error with a range not satisfiable error', async () => {
    server.setErrorToThrow(new RangeNotSatisfiable());

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(416);
    expect(response.body).to.be.deep.equal({ code: 'RANGE_NOT_SATISFIABLE' });
  });

  it('should return a custom message with a range not satisfiable error', async () => {
    server.setErrorToThrow(new RangeNotSatisfiable('CUSTOM_MESSAGE'));

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(416);
    expect(response.body).to.be.deep.equal({ code: 'CUSTOM_MESSAGE' });
  });

  it('should return a default message error with an internal server error', async () => {
    server.setErrorToThrow(new InternalServerError());

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(500);
    expect(response.body).to.be.deep.equal({ code: 'INTERNAL_SERVER_ERROR' });
  });

  it('should return a custom message with an internal server error', async () => {
    server.setErrorToThrow(new InternalServerError('CUSTOM_MESSAGE'));

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(500);
    expect(response.body).to.be.deep.equal({ code: 'CUSTOM_MESSAGE' });
  });

  it('should return 500 when error is not an APIError or PaginationError', async () => {
    server.setErrorToThrow(new Error());

    const response = await request(server.getExpressApp()).get('/test');

    expect(response.status).to.be.equal(500);
    expect(response.body).to.be.deep.equal({ code: 'INTERNAL_SERVER_ERROR' });
  });

  it('should report an error when an unexpected error occurs', async () => {
    const errorReporter = server.getErrorReporter();
    const expectedError = new Error();

    server.setErrorToThrow(expectedError);

    await request(server.getExpressApp()).get('/test');

    expect(errorReporter.getErrorCount()).to.be.equal(1);
    expect(errorReporter.getLatestError()).to.be.equal(expectedError);
  });
});
