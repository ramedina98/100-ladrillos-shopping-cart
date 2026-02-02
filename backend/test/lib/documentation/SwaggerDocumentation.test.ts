import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Application, Response } from 'express';

vi.mock('swagger-jsdoc', () => ({
  default: vi.fn(() => ({ swagger: 'mocked-spec' }))
}));

vi.mock('swagger-ui-express', () => {
  const serveMock = vi.fn((next) => next());
  const setupMock = vi.fn(() => (res: Response) => res.end());

  return {
    default: {
      serve: serveMock,
      setup: setupMock
    },
    serve: serveMock,
    setup: setupMock
  };
});

import { SwaggerDocumentation } from '../../../src/lib/documentation/index.js';
import swaggerUi from 'swagger-ui-express';

describe('SwaggerDocumentation', () => {
  let app: Application;

  beforeEach(() => {
    app = {
      use: vi.fn()
    } as unknown as Application;

    vi.clearAllMocks();
  });

  it('should instantiate successfully', () => {
    const swagger = new SwaggerDocumentation();
    expect(swagger).toBeDefined();
  });

  it('should register swagger route using app.use', () => {
    const swagger = new SwaggerDocumentation();
    swagger.setup(app);

    expect(app.use).toHaveBeenCalledOnce();
    expect(app.use).toHaveBeenCalledWith(
      '/api-docs',
      swaggerUi.serve,
      expect.any(Function)
    );
  });

  it('should call swagger-ui setup with the swagger spec', () => {
    const swagger = new SwaggerDocumentation();
    swagger.setup(app);

    expect(swaggerUi.setup).toHaveBeenCalledOnce();
    expect(swaggerUi.setup).toHaveBeenCalledWith({ swagger: 'mocked-spec' });
  });
});
