import CartError from './CartError.js';

class CartNotEditable extends CartError {
  constructor(options?: ErrorOptions) {
    super('Cart not editable', options);
  }
}

export default CartNotEditable;
