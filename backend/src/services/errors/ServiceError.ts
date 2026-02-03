/* eslint-disable @typescript-eslint/no-explicit-any */
class ServiceError extends Error {
  constructor(message: string, options?: ErrorOptions)
  constructor(options?: ErrorOptions)
  constructor(...args: any[]) {
    if (typeof args[0] === 'string') {
      super(...args);
    } else {
      super('Service error', ...args);
    }

    this.name = this.constructor.name;
  }
}

export default ServiceError;
