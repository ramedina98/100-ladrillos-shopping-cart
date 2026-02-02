import APIError from './APIError.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
class NotFound extends APIError {
  constructor(code: string, options?: ErrorOptions)
  constructor(options?: ErrorOptions)
  constructor(...args: any[]) {
    if (args.length > 0 && typeof args[0] === 'string') {
      super(404, args[0], ...args.slice(1));
    } else {
      super(404, 'NOT_FOUND', ...args);
    }
  }
}

export default NotFound;
