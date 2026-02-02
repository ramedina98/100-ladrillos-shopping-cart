import type { BrickStatus } from '../Brick.js';

import BrickError from './BrickError.js';

class BrickNotAvailable extends BrickError {
  readonly status: BrickStatus;

  constructor(status: BrickStatus, options?: ErrorOptions) {
    super('Brick not available', options);

    this.status = status;
  }
}

export default BrickNotAvailable;
