import type { BrickStatus } from '../Brick.js';

import BrickError from './BrickError.js';

class BrickPriceLocked extends BrickError {
  readonly status: BrickStatus;

  constructor(status: BrickStatus, options?: ErrorOptions) {
    super('Brick price cannot change during an active transaction', options);

    this.status = status;
  }
}

export default BrickPriceLocked;
