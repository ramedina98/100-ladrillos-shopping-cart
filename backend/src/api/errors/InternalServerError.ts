import APIError from './APIError.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
class InternalServerError extends APIError {
  constructor(code: string, options?: ErrorOptions)
  constructor(options?: ErrorOptions)
  constructor(...args: any[]) {
    if (args.length > 0 && typeof args[0] === 'string') {
      super(500, args[0], ...args.slice(1));
    } else {
      super(500, 'INTERNAL_SERVER_ERROR', ...args);
    }
  }
}

export default InternalServerError;
