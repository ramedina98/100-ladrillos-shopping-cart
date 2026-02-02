/* eslint-disable @typescript-eslint/no-explicit-any */
class CartError extends Error {
  constructor(message: string, options?: ErrorOptions)
  constructor(options?: ErrorOptions)
  constructor(...args: any[]) {
    if (typeof args[0] === 'string') {
      super(...args);
    } else {
      super('Cart error', ...args);
    }

    this.name = this.constructor.name;
  }
}

export default CartError;
