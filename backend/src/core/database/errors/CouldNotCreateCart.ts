import DatabaseError from './DatabaseError.js';

class CouldNotCreateCart extends DatabaseError {
  constructor(options) {
    super('Could not create cart', options);
  }
}

export default CouldNotCreateCart;
