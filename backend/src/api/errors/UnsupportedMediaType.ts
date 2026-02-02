import APIError from './APIError.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
class UnsupportedMediaType extends APIError {
  constructor(code: string, options?: ErrorOptions)
  constructor(options?: ErrorOptions)
  constructor(...args: any[]) {
    if (args.length > 0 && typeof args[0] === 'string') {
      super(415, args[0], ...args.slice(1));
    } else {
      super(415, 'UNSUPPORTED_MEDIA_TYPE', ...args);
    }
  }
}

export default UnsupportedMediaType;
