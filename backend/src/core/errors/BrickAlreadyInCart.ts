import CartError from './CartError.js';

class BrickAlreadyInCart extends CartError {
  readonly id: string;

  constructor(id: string, options?: ErrorOptions) {
    super(`Brick with id "${id}" already in cart`, options);

    this.id = id;
  }
}

export default BrickAlreadyInCart;
