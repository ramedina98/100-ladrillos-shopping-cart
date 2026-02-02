import APIError from './APIError.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
class MethodNotAllowed extends APIError {
  constructor(code: string, options?: ErrorOptions)
  constructor(options?: ErrorOptions)
  constructor(...args: any[]) {
    if (args.length > 0 && typeof args[0] === 'string') {
      super(405, args[0], ...args.slice(1));
    } else {
      super(405, 'METHOD_NOT_ALLOWED', ...args);
    }
  }

}

export default MethodNotAllowed;
