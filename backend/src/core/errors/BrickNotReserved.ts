import BrickError from './BrickError.js';

class BrickNotReserved extends BrickError {
  constructor(options?: ErrorOptions) {
    super('Brick must be reserved before selling', options);
  }
}

export default BrickNotReserved;
