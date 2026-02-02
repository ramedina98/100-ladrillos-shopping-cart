import APIError from './APIError.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
class BadRequest extends APIError {
  constructor(code: string, options?: ErrorOptions)
  constructor(options?: ErrorOptions)
  constructor(...args: any[]) {
    if (args.length > 0 && typeof args[0] === 'string') {
      super(400, args[0], ...args.slice(1));
    } else {
      super(400, 'BAD_REQUEST', ...args);
    }
  }
}

export default BadRequest;
