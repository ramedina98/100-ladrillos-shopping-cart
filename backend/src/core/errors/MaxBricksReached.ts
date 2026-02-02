import PropertyError from './PropertyError.js';

class MaxBricksReached extends PropertyError {
  readonly maxBricks: number;

  constructor(maxBricks: number, options?: ErrorOptions) {
    super(`Maximum number of bricks "${maxBricks}" has been reached for this property`, options);

    this.maxBricks = maxBricks;
  }
}

export default MaxBricksReached;
