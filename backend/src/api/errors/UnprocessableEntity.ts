import APIError from './APIError.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
class UnprocessableEntity extends APIError {
  constructor(code: string, options?: ErrorOptions)
  constructor(options?: ErrorOptions)
  constructor(...args: any[]) {
    if (args.length > 0 && typeof args[0] === 'string') {
      super(422, args[0], ...args.slice(1));
    } else {
      super(422, 'UNPROCESSABLE_ENTITY', ...args);
    }
  }
}

export default UnprocessableEntity;
