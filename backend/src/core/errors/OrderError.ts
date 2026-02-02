/* eslint-disable @typescript-eslint/no-explicit-any */
class OrderError extends Error {
  constructor(message: string, options?: ErrorOptions)
  constructor(options?: ErrorOptions)
  constructor(...args: any[]) {
    if (typeof args[0] === 'string') {
      super(...args);
    } else {
      super('Order error', ...args);
    }

    this.name = this.constructor.name;
  }
}

export default OrderError;
