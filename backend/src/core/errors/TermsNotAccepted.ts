import { OrderStatus } from '../Order.js';

import OrderError from './OrderError.js';

class TermsNotAccepted extends OrderError {
  readonly status: OrderStatus;

  constructor(status: OrderStatus, options?: ErrorOptions) {
    super('Terms not accepted', options);

    this.status = status;
  }
}

export default TermsNotAccepted;
