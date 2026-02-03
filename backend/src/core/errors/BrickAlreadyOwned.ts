import CartError from './CartError.js';

class BrickAlreadyOwned extends CartError {
  brickId: string;

  constructor(brickId: string, options?: ErrorOptions) {
    super(`User already owns brick ${brickId}`, options);

    this.brickId = brickId;
  }
}

export default BrickAlreadyOwned;
