import DatabaseError from './DatabaseError.js';

class OrderNotFound extends DatabaseError {
  readonly id: string;

  constructor(id: string, options?: ErrorOptions) {
    super(`Order with id "${id}" was not found`, options);

    this.id = id;
  }
}

export default OrderNotFound;
