import BrickError from './BrickError.js';

class BrickHasNoOwner extends BrickError {
  constructor(options?: ErrorOptions) {
    super('Brick does not have an owner', options);
  }
}

export default BrickHasNoOwner;
