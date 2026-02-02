import type { BrickStatus } from '../Brick.js';

import CartError from './CartError.js';

class BrickNotAvailableToAdd extends CartError {
  readonly id: string;
  readonly status: BrickStatus;

  constructor(id: string, status: BrickStatus, options?: ErrorOptions) {
    super(`Brick with id "${id}" is not available to add`, options);

    this.id = id;
    this.status = status;
  }
}

export default BrickNotAvailableToAdd;
