import { OrderStatus } from '../Order.js';

import OrderError from './OrderError.js';

class OrderNotConfirmed extends OrderError {
  readonly status: OrderStatus;

  constructor(status: OrderStatus, options?: ErrorOptions) {
    super('Order not confirmed', options);

    this.status = status;
  }
}

export default OrderNotConfirmed;
