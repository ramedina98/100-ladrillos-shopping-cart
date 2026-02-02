import type { OrderStatus } from '../Order.js';

import OrderError from './OrderError.js';

class InvalidState extends OrderError {
  readonly currentState: OrderStatus;

  constructor(currentState: OrderStatus, options?: ErrorOptions) {
    super(`Invalid state "${currentState}"`, options);

    this.currentState = currentState;
  }
}

export default InvalidState;
