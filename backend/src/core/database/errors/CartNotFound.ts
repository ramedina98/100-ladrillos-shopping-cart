import DatabaseError from './DatabaseError.js';

class CartNotFound extends DatabaseError {
  readonly id: string;

  constructor(id: string, options?: ErrorOptions){
    super('Cart was not found', options);

    this.id = id;
  }
}

export default CartNotFound;
