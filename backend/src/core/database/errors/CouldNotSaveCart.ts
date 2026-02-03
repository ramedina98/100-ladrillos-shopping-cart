import DatabaseError from './DatabaseError.js';

class CouldNotSaveCart extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('CouldNotSaveCart', options);
  }
}

export default CouldNotSaveCart;
