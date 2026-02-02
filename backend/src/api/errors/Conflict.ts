import APIError from './APIError.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
class Conflict extends APIError {
  constructor(code: string, options?: ErrorOptions)
  constructor(options?: ErrorOptions)
  constructor(...args: any[]) {
    if (args.length > 0 && typeof args[0] === 'string') {
      super(409, args[0], ...args.slice(1));
    } else {
      super(409, 'CONFLICT', ...args);
    }
  }
}

export default Conflict;
