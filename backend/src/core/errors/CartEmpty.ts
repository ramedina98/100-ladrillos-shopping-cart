import CartError from './CartError.js';

class CartEmpty extends CartError {
  constructor(options?: ErrorOptions) {
    super('Cart is empty', options);
  }
}

export default CartEmpty;
