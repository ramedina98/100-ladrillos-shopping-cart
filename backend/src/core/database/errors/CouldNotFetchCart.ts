import DatabaseError from './DatabaseError.js';

class CouldNotFetchCart extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Could not fetch cart', options);
  }
}

export default CouldNotFetchCart;
